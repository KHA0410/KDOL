// Address matching uses the supplied workbook; area tags require explicit VNPT rules.
(() => {
    const indexes = new WeakMap();
    const normalize = value => String(value ?? '').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');

    const administrativeType = /\b(?:phuong|xa|dac khu|thi tran|quan|huyen|thi xa|tinh|thanh pho|tp)\b/;
    const stripType = value => value.replace(/^(?:phuong|xa|dac khu|thi tran|quan|huyen|thi xa|tinh|thanh pho|tp) /, '');
    const normalizeQuery = value => normalize(value)
        .replace(/\b(?:tp hcm|tphcm|hcm)\b/g, 'ho chi minh')
        .replace(/\bp\s*(\d+)\b/g, 'phuong $1')
        .replace(/\bq\s*(\d+)\b/g, 'quan $1');
    const makeFields = values => [...new Set(values.filter(Boolean).map(normalize))]
        .map(full => ({ full, bare: stripType(full) }));

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
        if (record.matchedOrigins?.length) {
            const areas = new Set(record.matchedOrigins.map(origin => classify({
                ...record, matchedOrigins: null, districtCode: origin.districtCode
            }, rules).id));
            if (areas.size > 1) return { id: 'mixed', label: 'Nội thành / Ngoại thành & Tỉnh' };
            return classify({ ...record, matchedOrigins: null, districtCode: record.matchedOrigins[0].districtCode }, rules);
        }
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
                branches: record.origins?.length
                    ? record.origins.map(origin => ({ origin, fields: makeFields([
                        record.wardName, record.provinceName, origin.wardName, origin.districtName, origin.provinceName
                    ]) }))
                    : [{ fields: makeFields([record.wardName, record.districtName, record.provinceName]) }],
                codes: [record.wardCode, record.officialWardCode, record.districtCode, record.provinceCode, record.provinceTmsCode].filter(Boolean)
            })));
        }
        const normalized = normalizeQuery(query);
        const numeric = /^\d+$/.test(normalized);
        return indexes.get(records)
            .filter(item => !provinceCode || item.record.provinceCode === provinceCode)
            .map(item => {
                const codeMatch = numeric && item.codes.some(code => code.startsWith(normalized));
                const branches = item.branches.filter(branch => codeMatch || matchesNames(branch.fields, normalized));
                if (!branches.length) return null;
                const record = item.record.origins?.length && normalized
                    ? { ...item.record, matchedOrigins: branches.map(branch => branch.origin) } : item.record;
                return { record, score: !normalized ? 0
                : item.record.wardCode === normalized || item.record.officialWardCode === normalized ? 4
                : item.ward === normalized || item.name === normalized ? 3
                : item.ward.startsWith(normalized) || item.name.startsWith(normalized) ? 2 : 1 };
            })
            .filter(item => item && (!area || classify(item.record).id === area))
            .sort((a, b) => b.score - a.score)
            .map(item => item.record);
    }

    window.KDOL_ADDRESS_SEARCH = Object.freeze({ normalize, classify, search });
})();
