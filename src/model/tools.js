const multer = require('multer')
const path = require('path')//獲取文件名用
const sd = require('silly-datetime')
const mkdirp = require('mkdirp')

let tools = {
    multer(){
        //這裡的程式直接在官方找即可
        const storage = multer.diskStorage({
            //配置上傳的目錄
            destination: async (req, file, cb)=> {
                //1.獲取當前日期 20211016
                let day = sd.format(new Date(),'YYYYMMDD')

                //2.按照日期生成圖片存儲目錄，mkdirp是一個異步的方法
                let dir = path.join("src/static/upload",day)
                await mkdirp(dir)

                cb(null, dir)//上傳之前目錄必須存在
            },
            //修改上傳後的文件名
            filename: function (req, file, cb) {
                //1.獲取後綴名
                let extname = path.extname(file.originalname)

                //2.根據時間戳生成文件名

                cb(null, file.originalname)
            }
        })

        const upload = multer({ storage: storage })
        return upload

    }
}

module.exports = tools