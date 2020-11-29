import cron from 'node-cron';
import {enqueueAllKeywords} from "app/useCase/enqueueAllKeywords";
import {AppContext} from "app/context";

export const registerCronJobs = (ctx: AppContext) => {
    cron.schedule('0 0 8 * * *', async () => {
        const out = await enqueueAllKeywords(ctx)();
        console.log("=== CRON OUTPUT ===");
        console.log("enqueueAllKeywords", out);
        console.log("=== ~ CRON OUTPUT ===");
    });
};
