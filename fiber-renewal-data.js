/* Giá gia hạn gói FiberVNN cũ từ Excel. Giá có VAT; null là ô trống hoặc ghi Không. */
window.KDOL_FIBER_RENEWAL = {
    "source": "Gia Han FiberVNN.xlsx",
    "pricesIncludeVat": true,
    "groups": [
        { "id": "legacy", "label": "F18 / F2H / F2E / F2K", "namePattern": "^F(?:18_|2[HEK]_)" },
        { "id": "standard", "label": "Fiber thường", "namePattern": "^Fiber(?:[0-9]+\\+?|NET)$" },
        { "id": "eco", "label": "FiberEco", "namePattern": "^Fiber(?:Eco[0-9]+|[0-9]+Eco)$" },
        { "id": "vip", "label": "FiberVIP", "namePattern": "^FiberVIP" }
    ],
    "schemes": [
        {
            "id": "retail",
            "label": "Bán lẻ",
            "periods": [
                "monthly",
                "quarterly",
                "half",
                "annual",
                "biennial"
            ]
        },
        {
            "id": "combo",
            "label": "Combo",
            "periods": [
                "half",
                "annual"
            ]
        }
    ],
    "periods": [
        {
            "id": "monthly",
            "label": "1 tháng"
        },
        {
            "id": "quarterly",
            "label": "3 tháng"
        },
        {
            "id": "half",
            "label": "6 tháng"
        },
        {
            "id": "annual",
            "label": "12 tháng"
        },
        {
            "id": "biennial",
            "label": "24 tháng"
        }
    ],
    "plans": [
        {
            "id": "fiber-renewal-3",
            "sourceRow": 3,
            "name": "F18_ĐB",
            "speedMbps": 20,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 185625,
                    "quarterly": 530000,
                    "half": 947000,
                    "annual": 1782000,
                    "biennial": 3342000
                },
                "combo": {
                    "half": 891000,
                    "annual": 1671000
                }
            }
        },
        {
            "id": "fiber-renewal-4",
            "sourceRow": 4,
            "name": "F2H_DB",
            "speedMbps": 35,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 247500,
                    "quarterly": 706000,
                    "half": 1263000,
                    "annual": 2376000,
                    "biennial": 4455000
                },
                "combo": {
                    "half": 1188000,
                    "annual": 2228000
                }
            }
        },
        {
            "id": "fiber-renewal-5",
            "sourceRow": 5,
            "name": "F2H_PT",
            "speedMbps": 35,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 264000,
                    "quarterly": 753000,
                    "half": 1347000,
                    "annual": 2535000,
                    "biennial": 4752000
                },
                "combo": {
                    "half": 1268000,
                    "annual": 2376000
                }
            }
        },
        {
            "id": "fiber-renewal-6",
            "sourceRow": 6,
            "name": "F2E_DB",
            "speedMbps": 50,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 371250,
                    "quarterly": 1059000,
                    "half": 1894000,
                    "annual": 3564000,
                    "biennial": 6683000
                },
                "combo": {
                    "half": 1782000,
                    "annual": 3342000
                }
            }
        },
        {
            "id": "fiber-renewal-7",
            "sourceRow": 7,
            "name": "F2E_PT",
            "speedMbps": 50,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 396000,
                    "quarterly": 1129000,
                    "half": 2020000,
                    "annual": 3802000,
                    "biennial": 7128000
                },
                "combo": {
                    "half": 1901000,
                    "annual": 3564000
                }
            }
        },
        {
            "id": "fiber-renewal-8",
            "sourceRow": 8,
            "name": "F2K_DB",
            "speedMbps": 60,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 412500,
                    "quarterly": 1176000,
                    "half": 2104000,
                    "annual": 3960000,
                    "biennial": 7425000
                },
                "combo": {
                    "half": 1980000,
                    "annual": 3713000
                }
            }
        },
        {
            "id": "fiber-renewal-9",
            "sourceRow": 9,
            "name": "F2K_PT",
            "speedMbps": 60,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 440000,
                    "quarterly": 1254000,
                    "half": 2244000,
                    "annual": 4224000,
                    "biennial": 7920000
                },
                "combo": {
                    "half": 2112000,
                    "annual": 3960000
                }
            }
        },
        {
            "id": "fiber-renewal-10",
            "sourceRow": 10,
            "name": "Fiber20",
            "speedMbps": 20,
            "internationalCommitment": "512 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 209000,
                    "quarterly": 596000,
                    "half": 1066000,
                    "annual": 2007000,
                    "biennial": 3762000
                },
                "combo": {
                    "half": 1004000,
                    "annual": 1881000
                }
            }
        },
        {
            "id": "fiber-renewal-11",
            "sourceRow": 11,
            "name": "Fiber26",
            "speedMbps": 26,
            "internationalCommitment": "512 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 220000,
                    "quarterly": 627000,
                    "half": 1122000,
                    "annual": 2112000,
                    "biennial": 3960000
                },
                "combo": {
                    "half": 1056000,
                    "annual": 1980000
                }
            }
        },
        {
            "id": "fiber-renewal-12",
            "sourceRow": 12,
            "name": "Fiber30",
            "speedMbps": 30,
            "internationalCommitment": "512 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 253000,
                    "quarterly": 722000,
                    "half": 1291000,
                    "annual": 2429000,
                    "biennial": 4554000
                },
                "combo": {
                    "half": 1215000,
                    "annual": 2277000
                }
            }
        },
        {
            "id": "fiber-renewal-13",
            "sourceRow": 13,
            "name": "FiberVIP30",
            "speedMbps": 30,
            "internationalCommitment": "768 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 326315,
                    "quarterly": 930000,
                    "half": 1665000,
                    "annual": 3133000,
                    "biennial": 5874000
                },
                "combo": {
                    "half": 1567000,
                    "annual": 2937000
                }
            }
        },
        {
            "id": "fiber-renewal-14",
            "sourceRow": 14,
            "name": "Fiber40",
            "speedMbps": 40,
            "internationalCommitment": "512 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 374000,
                    "quarterly": 1066000,
                    "half": 1908000,
                    "annual": 3591000,
                    "biennial": 6732000
                },
                "combo": {
                    "half": 1796000,
                    "annual": 3366000
                }
            }
        },
        {
            "id": "fiber-renewal-15",
            "sourceRow": 15,
            "name": "Fiber50Eco",
            "speedMbps": 50,
            "internationalCommitment": "512 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 550000,
                    "quarterly": 1568000,
                    "half": 2805000,
                    "annual": 5280000,
                    "biennial": 9900000
                },
                "combo": {
                    "half": 2640000,
                    "annual": 4950000
                }
            }
        },
        {
            "id": "fiber-renewal-16",
            "sourceRow": 16,
            "name": "Fiber50",
            "speedMbps": 50,
            "internationalCommitment": "1Mbps",
            "ip": "IP Tĩnh",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 715000,
                    "quarterly": 2038000,
                    "half": 3647000,
                    "annual": 6864000,
                    "biennial": 12870000
                },
                "combo": {
                    "half": 3432000,
                    "annual": 6435000
                }
            }
        },
        {
            "id": "fiber-renewal-17",
            "sourceRow": 17,
            "name": "FiberVIP50",
            "speedMbps": 50,
            "internationalCommitment": "1280 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 737715,
                    "quarterly": 2103000,
                    "half": 3763000,
                    "annual": 7083000,
                    "biennial": 13279000
                },
                "combo": {
                    "half": 3542000,
                    "annual": 6640000
                }
            }
        },
        {
            "id": "fiber-renewal-18",
            "sourceRow": 18,
            "name": "Fiber60Eco",
            "speedMbps": 60,
            "internationalCommitment": "768 Kbps",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 748000,
                    "quarterly": 2132000,
                    "half": 3815000,
                    "annual": 7181000,
                    "biennial": 13464000
                },
                "combo": {
                    "half": 3591000,
                    "annual": 6732000
                }
            }
        },
        {
            "id": "fiber-renewal-19",
            "sourceRow": 19,
            "name": "FiberNET",
            "speedMbps": 60,
            "internationalCommitment": "1 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 220000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 880000,
                    "quarterly": 2508000,
                    "half": 4488000,
                    "annual": 8448000,
                    "biennial": 15840000
                },
                "combo": {
                    "half": 4224000,
                    "annual": 7920000
                }
            }
        },
        {
            "id": "fiber-renewal-20",
            "sourceRow": 20,
            "name": "Fiber70Eco",
            "speedMbps": 70,
            "internationalCommitment": "1 Mbps",
            "ip": "Động",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 1100000,
                    "quarterly": 3135000,
                    "half": 5610000,
                    "annual": 10560000,
                    "biennial": 19800000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-21",
            "sourceRow": 21,
            "name": "Fiber70",
            "speedMbps": 70,
            "internationalCommitment": "1.5 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 1540000,
                    "quarterly": 4389000,
                    "half": 7854000,
                    "annual": 14784000,
                    "biennial": 27720000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-22",
            "sourceRow": 22,
            "name": "Fiber80Eco",
            "speedMbps": 80,
            "internationalCommitment": "1 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 1760000,
                    "quarterly": 5016000,
                    "half": 8976000,
                    "annual": 16896000,
                    "biennial": 31680000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-23",
            "sourceRow": 23,
            "name": "FiberVIP60",
            "speedMbps": 60,
            "internationalCommitment": "2 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 1980000,
                    "quarterly": 5643000,
                    "half": 10098000,
                    "annual": 19008000,
                    "biennial": 35640000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-24",
            "sourceRow": 24,
            "name": "Fiber80",
            "speedMbps": 80,
            "internationalCommitment": "2 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 2200000,
                    "quarterly": 6270000,
                    "half": 11220000,
                    "annual": 21120000,
                    "biennial": 39600000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-25",
            "sourceRow": 25,
            "name": "Fiber90Eco",
            "speedMbps": 90,
            "internationalCommitment": "1 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 2420000,
                    "quarterly": 6897000,
                    "half": 12342000,
                    "annual": 23232000,
                    "biennial": 43560000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-26",
            "sourceRow": 26,
            "name": "Fiber100Eco",
            "speedMbps": 100,
            "internationalCommitment": "1 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 2750000,
                    "quarterly": 7838000,
                    "half": 14025000,
                    "annual": 26400000,
                    "biennial": 49500000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-27",
            "sourceRow": 27,
            "name": "FiberVIP70",
            "speedMbps": 70,
            "internationalCommitment": "2.5 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 3300000,
                    "quarterly": 9405000,
                    "half": 16830000,
                    "annual": 31680000,
                    "biennial": 59400000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-28",
            "sourceRow": 28,
            "name": "Fiber90",
            "speedMbps": 90,
            "internationalCommitment": "2 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 3300000,
                    "quarterly": 9405000,
                    "half": 16830000,
                    "annual": 31680000,
                    "biennial": 59400000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-29",
            "sourceRow": 29,
            "name": "FiberVIP80",
            "speedMbps": 80,
            "internationalCommitment": "3 Mbps",
            "ip": "1 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 4400000,
                    "quarterly": 12540000,
                    "half": 22440000,
                    "annual": 42240000,
                    "biennial": 79200000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-30",
            "sourceRow": 30,
            "name": "Fiber100",
            "speedMbps": 100,
            "internationalCommitment": "2 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 4400000,
                    "quarterly": 12540000,
                    "half": 22440000,
                    "annual": 42240000,
                    "biennial": 79200000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-31",
            "sourceRow": 31,
            "name": "FiberVIP90",
            "speedMbps": 90,
            "internationalCommitment": "3 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 6600000,
                    "quarterly": 18810000,
                    "half": 33660000,
                    "annual": 63360000,
                    "biennial": 118800000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-32",
            "sourceRow": 32,
            "name": "Fiber100+",
            "speedMbps": 100,
            "internationalCommitment": "3 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 6600000,
                    "quarterly": 18810000,
                    "half": 33660000,
                    "annual": 63360000,
                    "biennial": 118800000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-33",
            "sourceRow": 33,
            "name": "FiberVIP100",
            "speedMbps": 100,
            "internationalCommitment": "4 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 8800000,
                    "quarterly": 25080000,
                    "half": 44880000,
                    "annual": 84480000,
                    "biennial": 158400000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-34",
            "sourceRow": 34,
            "name": "Fiber120",
            "speedMbps": 120,
            "internationalCommitment": "3 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 8800000,
                    "quarterly": 25080000,
                    "half": 44880000,
                    "annual": 84480000,
                    "biennial": 158400000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-35",
            "sourceRow": 35,
            "name": "Fiber150Eco",
            "speedMbps": 150,
            "internationalCommitment": "3 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 11000000,
                    "quarterly": 31350000,
                    "half": 56100000,
                    "annual": 105600000,
                    "biennial": 198000000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-36",
            "sourceRow": 36,
            "name": "Fiber150",
            "speedMbps": 150,
            "internationalCommitment": "4 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 13200000,
                    "quarterly": 37620000,
                    "half": 67320000,
                    "annual": 126720000,
                    "biennial": 237600000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-37",
            "sourceRow": 37,
            "name": "Fiber200",
            "speedMbps": 200,
            "internationalCommitment": "4 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 16500000,
                    "quarterly": 47025000,
                    "half": 84150000,
                    "annual": 158400000,
                    "biennial": 297000000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-38",
            "sourceRow": 38,
            "name": "FiberVIP150",
            "speedMbps": 150,
            "internationalCommitment": "5 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 17600000,
                    "quarterly": 50160000,
                    "half": 89760000,
                    "annual": 168960000,
                    "biennial": 316800000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-39",
            "sourceRow": 39,
            "name": "FiberVIP200",
            "speedMbps": 200,
            "internationalCommitment": "6 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 22000000,
                    "quarterly": 62700000,
                    "half": 112200000,
                    "annual": 211200000,
                    "biennial": 396000000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-40",
            "sourceRow": 40,
            "name": "Fiber300",
            "speedMbps": 300,
            "internationalCommitment": "5 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 22000000,
                    "quarterly": 62700000,
                    "half": 112200000,
                    "annual": 211200000,
                    "biennial": 396000000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-41",
            "sourceRow": 41,
            "name": "FiberVIP300",
            "speedMbps": 300,
            "internationalCommitment": "8 Mbps",
            "ip": "6 IP tĩnh",
            "setupPrice": 330000,
            "note": "",
            "prices": {
                "retail": {
                    "monthly": 33000000,
                    "quarterly": 94050000,
                    "half": 168300000,
                    "annual": 316800000,
                    "biennial": 594000000
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-42",
            "sourceRow": 42,
            "name": "FiberEco1",
            "speedMbps": 15,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "Các trạm GPON HS thấp",
            "prices": {
                "retail": {
                    "monthly": 150000,
                    "quarterly": null,
                    "half": 720000,
                    "annual": 1350000,
                    "biennial": null
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        },
        {
            "id": "fiber-renewal-43",
            "sourceRow": 43,
            "name": "FiberEco2",
            "speedMbps": 26,
            "internationalCommitment": "Không",
            "ip": "Động",
            "setupPrice": 220000,
            "note": "Các trạm GPON HS thấp",
            "prices": {
                "retail": {
                    "monthly": 170000,
                    "quarterly": null,
                    "half": 816000,
                    "annual": 1530000,
                    "biennial": null
                },
                "combo": {
                    "half": null,
                    "annual": null
                }
            }
        }
    ]
};
