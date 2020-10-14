import cron from 'node-cron';
import {enqueueAllKeywords} from "app/useCase/enqueueAllKeywords";
import {AppContext} from "app/context";

export const registerCronJobs = (ctx: AppContext) => {
    cron.schedule('0 0 * * *', () => {
        enqueueAllKeywords(ctx);
    });
};