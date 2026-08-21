export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { links, service_id, api_key } = req.body;

        if (!links || !service_id || !api_key) {
            return res.status(400).json({ success: false, message: 'الرجاء التأكد من إدخال البيانات المطلوبة' });
        }

        const linkArray = links.split('\n').map(link => link.trim()).filter(link => link.length > 0);
        
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

                const response = await fetch(SMM_API_URL, {
                    method: 'POST',
                    body: params,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

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
