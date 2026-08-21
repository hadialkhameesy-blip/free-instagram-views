export default async function handler(req, res) {
    // السماح فقط بطلبات POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { links, service_id, api_key } = req.body || {};

        if (!links || !service_id || !api_key) {
            return res.status(400).json({ 
                success: false, 
                message: 'البيانات غير مكتملة، يجيب توفر الروابط ورقم الخدمة ومفتاح الـ API.' 
            });
        }

        const linkArray = links.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        if (linkArray.length === 0) {
            return res.status(400).json({ success: false, message: 'لا توجد روابط صالحة للإرسال' });
        }

        const results = [];
        const SMM_API_URL = 'https://my.smm-panel.com/api/v2';

        for (const link of linkArray) {
            try {
                const params = new URLSearchParams();
                params.append('key', api_key);
                params.append('action', 'add');
                params.append('service', service_id);
                params.append('link', link);
                params.append('quantity', '1000');

                const apiResponse = await fetch(SMM_API_URL, {
                    method: 'POST',
                    body: params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const textData = await apiResponse.text();
                let jsonData;
                
                try {
                    jsonData = JSON.parse(textData);
                } catch (parseErr) {
                    jsonData = { status: "fail", error: "استجابة غير صالحة من المزود", raw: textData };
                }

                results.push({ link, response: jsonData });
            } catch (err) {
                results.push({ link, response: { status: "fail", error: err.message } });
            }
        }

        // إرجاع النتيجة نهائياً بصيغة JSON سليمة
        return res.status(200).json({ success: true, results });

    } catch (error) {
        // ضمان عدم انهيار السيرفر وإرجاع رسالة خطأ واضحة بصيغة JSON
        return res.status(500).json({ 
            success: false, 
            message: 'خطأ داخلي في الخادم: ' + (error.message || error) 
        });
    }
}
