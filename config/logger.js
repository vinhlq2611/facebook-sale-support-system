const {
    createLogger,
    transports,
    format
} = require('winston')
require('winston-mongodb')
const logger = createLogger({
    transports: [
        new transports.MongoDB({
            level: 'error',
            db: `mongodb+srv://Vinh2611:amingovictus@cluster0.6og83.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            options: { useUnifiedTopology: true },
            collection: 'logger_error',
            format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json())
        }),
        new transports.MongoDB({
            level: 'warn',
            db:  `mongodb+srv://Vinh2611:amingovictus@cluster0.6og83.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            options: { useUnifiedTopology: true },
            collection: 'logger_warn',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.json(),
                format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', '_id'] }))
        })
    ]
})
module.exports = logger
//  cách dùng logger: tương tự console.log vd: logger.error("Hello ")<=> console.log("Hello")