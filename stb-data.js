/* Giá Set-top-box theo hai ảnh người dùng cung cấp.
 * B2C đã gồm VAT; B2B chưa gồm VAT.
 * Người dùng xác nhận B2C không có kỳ 4 tháng.
 */
window.KDOL_STB = {
    service: { id: 'stb', category_id: 'brcd', name: 'Set-top-box', sort_order: 5 },
    b2c: {
        vatIncluded: true,
        periods: [
            { id: 'monthly', label: '1 tháng', note: 'Áp dụng trả sau hoặc trả trước.' },
            { id: 'quarterly', label: '3 tháng' },
            { id: 'six-to-nine', label: '6–9 tháng', note: 'Cùng mức giá cho các kỳ 6, 7, 8 hoặc 9 tháng theo bảng nguồn.' },
            { id: 'annual-to-eighteen', label: '12–18 tháng', note: 'Cùng mức giá cho các kỳ 12, 13, 14, 15, 16, 17 hoặc 18 tháng theo bảng nguồn.' }
        ],
        plans: [
            { id: 'stb-1', name: '1 STB', quantity: 1, prices: [50000, 150000, 300000, 600000] },
            { id: 'stb-2', name: '2 STB', quantity: 2, prices: [100000, 300000, 600000, 1200000] },
            { id: 'stb-3', name: '3 STB', quantity: 3, prices: [150000, 450000, 900000, 1800000] },
            { id: 'stb-4', name: '4 STB', quantity: 4, prices: [200000, 600000, 1200000, 2400000] },
            { id: 'stb-5', name: '5 STB', quantity: 5, prices: [250000, 750000, 1500000, 3000000] }
        ]
    },
    b2b: {
        vatIncluded: false,
        monthlyStbRental: 40000,
        plans: [
            { id: 'standard', name: 'MyTV B2B Standard', monthlyWithoutStb: 70000, monthlyWithStb: 110000 },
            { id: 'gold', name: 'MyTV B2B Gold', monthlyWithoutStb: 180000, monthlyWithStb: 220000 },
            { id: 'premium', name: 'MyTV B2B Premium', monthlyWithoutStb: 240000, monthlyWithStb: 280000 },
            { id: 'diamond', name: 'MyTV B2B Diamond', monthlyWithoutStb: 370000, monthlyWithStb: 410000 }
        ]
    }
};
