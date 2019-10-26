// QRCodeFileGen.ts
import * as QRCode from "qrcode";
interface _IQRCodeOption {
    filename:string,
    type:string,
}
export class QRCodeFileGenClass {
    option: _IQRCodeOption;
    toFile(filepath:string, filetype:string, value:any){
        this.option = {
            filename: filepath,
            type: filetype
        }
        QRCode.toFile(this.option.filename, value, this.option);
    }
}
