export default {
    async fetch(request, env) {

        return new Response(
            "WORKER ÇALIŞIYOR",
            {
                status: 200,
                headers: {
                    "Content-Type":
                        "text/plain; charset=UTF-8"
                }
            }
        );

    }
};
