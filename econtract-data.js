/* eContract SaaS, OnPremise, add-on và chiết khấu theo ảnh người dùng cung cấp.
 * Giá chưa VAT. TSA theo bảng giá Add-on VNPT TSA và chính sách tối đa 30%.
 * Chi tiết: supabase-info/econtract-reference.md.
 */
window.KDOL_ECONTRACT = {
    saasSetupPrice: 2000000,
    onpremSetupPrice: 100000000,
    onpremUsagePercent: 50,
    emaxMinimum: 10000,
    emaxUnitPrice: 5000,
    storagePerContractMB: 5,
    smsUnitPrice: 800,
    ekycUnitPrice: 3000,
    storageUnitPrice: 90000,
    storageUnitMB: 250,
    storageYears: 10,
    customerConditions: [
        { id: 'quantity', label: 'Theo số hợp đồng, không có điều kiện khách hàng riêng', serviceDiscount: 0, saasSetupDiscount: 0, onpremSetupDiscount: 0 },
        { id: 'existing', label: 'Khách hàng hiện hữu còn lại của VNPT', serviceDiscount: 10, saasSetupDiscount: 10, onpremSetupDiscount: 10 },
        { id: 'revenue10to30', label: 'KH hiện hữu, doanh thu từ 10 đến dưới 30 triệu/tháng', serviceDiscount: 20, saasSetupDiscount: 50, onpremSetupDiscount: 20 },
        { id: 'largeExisting', label: 'KH lớn hiện hữu, doanh thu từ 30 triệu/tháng', serviceDiscount: 30, saasSetupDiscount: 100, onpremSetupDiscount: 30 },
        { id: 'competition', label: 'Khách hàng có cạnh tranh về giá của đối thủ', serviceDiscount: 30, saasSetupDiscount: 100, onpremSetupDiscount: 30 }
    ],
    saasPlans: [
        { duration_text: 'E50', quantity: 50, storageMB: 250, price: 350000 },
        { duration_text: 'E100', quantity: 100, storageMB: 500, price: 650000 },
        { duration_text: 'E200', quantity: 200, storageMB: 1000, price: 1200000 },
        { duration_text: 'E500', quantity: 500, storageMB: 2500, price: 2900000 },
        { duration_text: 'E1000', quantity: 1000, storageMB: 5000, price: 5600000 },
        { duration_text: 'E2000', quantity: 2000, storageMB: 10000, price: 10800000 },
        { duration_text: 'E5000', quantity: 5000, storageMB: 25000, price: 26000000 }
    ],
    tsa: {
        maxDiscount: 30,
        minLimit: 5000,
        minUnitPrice: 1000,
        maxLimit: 50000,
        maxUnitPrice: 500,
        plans: [
            { duration_text: 'TSA CeCA 5.000', quantity: 5000, unitPrice: 900, price: 4500000 },
            { duration_text: 'TSA CeCA 10.000', quantity: 10000, unitPrice: 800, price: 8000000 },
            { duration_text: 'TSA CeCA 20.000', quantity: 20000, unitPrice: 700, price: 14000000 },
            { duration_text: 'TSA CeCA 50.000', quantity: 50000, unitPrice: 600, price: 30000000 }
        ]
    }
};
