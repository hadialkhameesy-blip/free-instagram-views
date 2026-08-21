export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }

    try {
        const { links, service_id, api_key } = req.body;

        if (!links || !service_id || !api_key) {
            return res.status(400).json({ success: false, message: 'الرجاء التأكد من إدخال جميع البيانات المطلوبة' });
        }

        const linkArray = links.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        if (linkArray.length === 0) {
            return res.status(400).json({ success: false, message: 'لا توجد روابط صالحة للإرسال' });
        }

        const results = [];
        const SMM_API_URL = 'https://my.smm-panel.com/api/v2';

        for (const link of linkArray) {
            try {
                // تجهيز البيانات بالصيغة المدعومة لمواقع SMM Panels
                const formData = new URLSearchParams();
                formData.append('key', api_key);
                formData.append('action', 'add');
                formData.append('service', service_id);
                formData.append('link', link);
                formData.append('quantity', '1000');

                const apiResponse = await fetch(SMM_API_URL, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0'
                    }
                });

                const rawText = await apiResponse.text();
                
                let jsonResult;
                try {
                    jsonResult = JSON.parse(rawText);
                } catch (parseError) {
                    jsonResult = { error: "استجابة غير صالحة من المزود", raw: rawText };
                }

                results.push({ link, response: jsonResult });
            } catch (err) {
                results.push({ link, error: err.message });
            }
        }

        return res.status(200).json({ success: true, results });

    } catch (error) {
        console.error('Critical Server Error:', error);
        return res.status(500).json({ success: false, message: 'خطأ داخلي في الخادم: ' + error.message });
    }
}

                const responseText = await response.text();
                
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    data = { status: "error", message: "استجابة غير صالحة من المزود", raw: responseText };
                }

                results.push({ link, response: data });
            } catch (err) {
                results.push({ link, error: err.message });
            }
        }

        return res.status(200).json({ success: true, results });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: 'خطأ في السيرفر: ' + error.message });
    }
}
                const responseText = await response.text();
                
                // التأكد أن الرد عبارة عن JSON صالح قبل تحويله
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    data = { status: "error", message: "استجابة غير صالحة من المزود", raw: responseText };
                }

                results.push({ link, response: data });
            } catch (err) {
                results.push({ link, error: err.message });
            }
        }

        return res.status(200).json({ success: true, results });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: 'خطأ في السيرفر: ' + error.message });
    }
}
