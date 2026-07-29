export default {
    async fetch(request, env) {

        return new Response(
            "Pazar Kuyumcular Worker çalışıyor.",
            {
                status: 200,
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8"
                }
            }
        );

    }
};
