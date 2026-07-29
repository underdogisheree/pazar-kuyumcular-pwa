export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        return new Response(
            JSON.stringify({
                worker: "pazar-kuyumcular-pwa",
                path: url.pathname,
                message: "GÜNCEL WORKER ÇALIŞIYOR"
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        );

    }
};
