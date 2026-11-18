// Address matching uses the supplied workbook; area tags require explicit VNPT rules.
(() => {
    const indexes = new WeakMap();
    const normalize = value => String(value ?? '').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');

    const administrativeType = /\b(?:phuong|xa|dac khu|quan|huyen|thi xa|tinh|thanh pho|tp)\b/;
    const stripType = value => value.replace(/^(?:phuong|xa|dac khu|quan|huyen|thi xa|tinh|thanh pho|tp) /, '');

    function matchesNames(fields, query) {
        if (!query) return true;
        // Keep the query together within one name. Digits must match a complete
        // word: "quận 1" must never match "quận 10" or an unrelated TMS code.
        const end = /\d$/.test(query) ? '(?= |$)' : '';
        const phrase = new RegExp('(?:^| )' + query + end);
        if (fields.some(field => phrase.test(field.full))) return true;

        // Combined queries may contain complete place names in either order,
        // e.g. "Hà Nội Hoàn Kiếm". Consume a complete name before matching the
        // other field, rather than scattering individual words across fields.
        const typed = administrativeType.test(query);
        for (let i = 0; i < fields.length; i++) {
            const variants = typed ? [fields[i].full] : [fields[i].full, fields[i].bare];
            for (const name of variants) {
                const marker = ' ' + name + ' ';
                const padded = ' ' + query + ' ';
                if (!name || !padded.includes(marker)) continue;
                const remaining = padded.replace(marker, ' ').trim();
                if (matchesNames(fields.filter((_, index) => index !== i), remaining)) return true;
            }
        }
        return false;
    }

    function classify(record, rules = window.KDOL_ADDRESS_REGIONS) {
        const id = rules?.wardCodes?.[record.wardCode]
            ?? rules?.districtCodes?.[record.districtCode]
            ?? rules?.districtPrefixes?.[record.districtCode?.slice(0, 3)]
            ?? rules?.defaultArea;
        if (id === 'noi') return { id, label: 'Nội thành' };
        if (id === 'ngoai') return { id, label: 'Ngoại thành & Tỉnh' };
        return { id: 'unknown', label: 'Chưa phân loại' };
    }

    function search(records, query, provinceCode = '', area = '') {
        if (!indexes.has(records)) {
            indexes.set(records, records.map(record => ({
                record,
                ward: normalize(record.wardName),
                name: normalize(record.wardName).replace(/^(phuong|xa|dac khu) /, ''),
                fields: [record.wardName, record.districtName, record.provinceName].map(value => {
                    const full = normalize(value);
                    return { full, bare: stripType(full) };
                }),
                codes: [record.wardCode, record.districtCode, record.provinceCode, record.provinceTmsCode]
            })));
        }
        const normalized = normalize(query);
        const numeric = /^\d+$/.test(normalized);
        return indexes.get(records)
            .filter(item => (!provinceCode || item.record.provinceCode === provinceCode)
                && (!area || classify(item.record).id === area)
                && (matchesNames(item.fields, normalized)
                    || (numeric && item.codes.some(code => code.startsWith(normalized)))))
            .map(item => ({ record: item.record, score: !normalized ? 0
                : item.record.wardCode === normalized ? 4
                : item.ward === normalized || item.name === normalized ? 3
                : item.ward.startsWith(normalized) || item.name.startsWith(normalized) ? 2 : 1 }))
            .sort((a, b) => b.score - a.score)
            .map(item => item.record);
    }

    window.KDOL_ADDRESS_SEARCH = Object.freeze({ normalize, classify, search });
})();
