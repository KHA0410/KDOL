"""Import the supplied Viettel/FPT price workbook without inferring missing prices.

Usage: python scripts/import-internet-comparison.py workbook.xlsx
Only cell values are read; workbook formulas or instructions are never executed.
"""

import hashlib
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
import zipfile


def import_catalog(source):
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    with zipfile.ZipFile(source) as workbook:
        strings = ["".join(item.itertext()) for item in ET.fromstring(workbook.read("xl/sharedStrings.xml")).findall("m:si", ns)]
        sheet = ET.fromstring(workbook.read("xl/worksheets/sheet1.xml"))
        cells = {}
        for cell in sheet.findall(".//m:sheetData/m:row/m:c", ns):
            value, inline = cell.find("m:v", ns), cell.find("m:is", ns)
            text = value.text if value is not None else "".join(inline.itertext()) if inline is not None else ""
            cells[cell.attrib["r"]] = strings[int(text)] if cell.get("t") == "s" else text
        for merge in sheet.findall(".//m:mergeCell", ns):
            start, end = merge.attrib["ref"].split(":")
            first, last = re.fullmatch(r"([A-Z]+)(\d+)", start), re.fullmatch(r"([A-Z]+)(\d+)", end)
            if first[1] == last[1]:
                for row in range(int(first[2]), int(last[2]) + 1):
                    cells[f"{first[1]}{row}"] = cells.get(start, "")

    plans, unclassified = [], []
    for provider, rows, header_row in [("viettel", range(3, 17), 2), ("fpt", range(20, 34), 19)]:
        for row in rows:
            name = cells.get(f"A{row}", "").strip()
            description = " ".join(cells.get(f"B{row}", "").split())
            region = {"Nội thành": "noi", "Ngoại thành": "nt"}.get(cells.get(f"C{row}", "").strip())
            speed = 1000 if re.search(r"1\s*G[Bb]", description) else int(re.search(r"(\d+)\s*(?:Mbps|ULM)", description)[1])
            for column in "DEFGHIJK":
                cell = f"{column}{row}"
                raw = cells.get(cell, "").strip()
                price_match = re.match(r"^(\d+)", raw)
                if not price_match or int(price_match[1]) <= 0:
                    continue
                header = cells.get(f"{column}{header_row}", "").strip()
                if header.lower() == "x" or not header:
                    unclassified.append({"provider": provider, "name": name, "region": region, "price": int(price_match[1]), "sourceCell": cell})
                    continue
                has_mesh, tv, camera = "Mesh" in header, "TV" in header, "Cam" in header
                mesh_match = re.search(r"(\d+)\s*Mesh", description)
                mesh_count = int(mesh_match[1]) if has_mesh and mesh_match else None if has_mesh else 0
                detail = [description, header]
                if has_mesh and mesh_count is None:
                    detail.append("Chưa ghi số lượng Mesh")
                if "Ngoại Hạng Anh" in header:
                    detail.append("Có Ngoại Hạng Anh")
                if "(" in raw:
                    detail.append(raw[raw.index("(") + 1:].rstrip(")"))
                plans.append({
                    "id": f"{provider}-{cell.lower()}", "provider": provider, "name": name,
                    "region": region, "speedMbps": 350 if name == "NETVT1" and camera else speed,
                    "meshCount": mesh_count, "hasMesh": has_mesh, "tv": tv, "camera": camera,
                    "monthlyPrice": int(price_match[1]), "details": " · ".join(detail), "sourceCell": cell
                })
    return {
        "source": {"filename": source.name, "sheet": "Trang_tính1", "importedOn": "2026-11-19",
                   "sha256": hashlib.sha256(source.read_bytes()).hexdigest()},
        "plans": plans, "unclassified": unclassified
    }


if __name__ == "__main__":
    source = Path(sys.argv[1])
    target = Path(__file__).resolve().parent.parent / "internet-comparison-data.js"
    catalog = import_catalog(source)
    target.write_text("/* Giá đối chiếu từ Excel người dùng cung cấp; không phải báo giá trực tuyến. */\nwindow.KDOL_INTERNET_COMPARISON = " + json.dumps(catalog, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"Imported {len(catalog['plans'])} prices; {len(catalog['unclassified'])} unclassified cells retained separately.")
