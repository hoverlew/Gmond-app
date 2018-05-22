/**
 * 小程序配置文件
 */
var app = getApp();
var host = app.siteInfo.siteroot;
var uniacid = app.siteInfo.uniacid;
var hashKey = app.siteInfo.HashKey;
var config = {
	// 下面的地址配合云端 Server 工作
	host,
	maintitle: app.siteInfo.title,
	// 测试的请求地址，用于测试会话
	//requestUrl: `https://${host}/app/index.php?i=7&c=entry&m=kuaiwei_mall`,
	requestUrl: `${host}?i=${uniacid}&c=entry&m=kuaiwei_mall`,
	HashKey: hashKey,
};

module.exports = config
