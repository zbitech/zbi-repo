import Queue from "bull";

// const instanceQueue = new Queue('instance', {process.env.REDIS_URL});

// instanceQueue.process(async (job:any) => {

//     const { slug, task } = job.data;

//     try {
//         switch (task) {
//             case "start":
                
//                 break;
        
//             case "stop":
                
//             default:
//                 return Promise.resolve({sent: true, slug});
//         }
        
//     } catch (err) {
//         return Promise.reject(err);
//     }
// });
