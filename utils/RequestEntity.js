var RequestEntity = {
	///1-PC客户端;2-Web;3-android移动端;4-iOS移动端;5-Top回调;6-JOS回调;7-微信小程序
	AppType:7,
	PartnerId:"yzd-ecommerce-wx",
	pageIndex:1,
	pageSize:50,
	AppVersion:"1.0",
	Token:"",
	TimeStamp:"",
	DeviceInfo:"",
	DeviceState:"",

	OperateUserId:0,
	//方法及回应
	ControlName:"",
	MethodName:"",
	//public ResponseEntity Response= null;
	//传输的对象内容，base64 格式
	Body:"",
	//图片等多媒体大对象
	Bytes:""
};
module.exports = RequestEntity