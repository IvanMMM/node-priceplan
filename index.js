"use strict";
/*
    API к http://docs.priceplan.ru
 */

const util = require("util");
const qs = require('querystring');
const rp = require('request-promise');

class PP{
    constructor(baseurl,key,password){
        if(!baseurl) throw new Error(`Invalid URL`);
        if(!key) throw new Error(`Invalid Key`);
        if(!password) throw new Error(`Invalid Password`);

        this._baseurl = baseurl;
        this._key = key;
        this._password = password;
    }

    get(endpoint,params={}){
        return this.request.call(this,endpoint,params,"GET")
    }

    post(endpoint,params={}){
        return this.request.call(this,endpoint,params,"POST")
    }

    delete(endpoint,params={}){
        return this.request.call(this,endpoint,params,"DELETE")
    }

    request(endpoint,params={},method='GET'){
        let options = {
            url:`${this._baseurl}key/${endpoint}`,
            method:method,
            json:true,
            auth:{
                user:this._key,
                pass:this._password,
            }
        };
        if(method==="GET"){
            options.qs = params;
        }else{
            options.json = params;
        }
        if(this.proxy){
          options.rejectUnauthorized = false;
          options.proxy = this.proxy;
        }
        let startedAt;
        if(this.debug){
          startedAt = Date.now();
          console.info(`Priceplan: ${method} ${endpoint} >>> ${JSON.stringify(params)}`);
        }
        return rp(options)
        .then(body=>{
            if(this.debug) console.info(`Priceplan: ${method} ${endpoint} <<< ${JSON.stringify(body)} <<< ${Date.now() - startedAt}`);
            if(body.success===true) return body.data || body;
            throw new exceptions[body.errors[0].code.toString()](body.errors[0].data);
        })
    }
}

let exceptions = {
    '-1':function(){
        this.name = "Unknown";
        this.message = `Произошла неизвестная ошибка. ${Object.values(arguments).join()}`;
    },
    '1':function(){
        this.name = "Duplicate";
        this.message = `Дубликат значения. ${Object.values(arguments).join()}`;
    },
    '2':function(){
        this.name = "EmptyValue";
        this.message = `Пустое значенине. ${Object.values(arguments).join()}`;
    },
    '3':function(){
        this.name = "InvalidArgument";
        this.message = `Некорректный аргумент. ${Object.values(arguments).join()}`;
    },
    '4':function(){
        this.name = "MissingArgument";
        this.message = `Не указан аргумент. ${Object.values(arguments).join()}`;
    },
    '5':function(){
        this.name = "InvalidData";
        this.message = `Некорректные данные. ${Object.values(arguments).join()}`;
    },
    '6':function(){
        this.name = "ObjectNotFound";
        this.message = `Объект не найден. ${Object.values(arguments).join()}`;
    },
    '7':function(){
        this.name = "BadRequest";
        this.message = `Неверный запрос. ${Object.values(arguments).join()}`;
    },
    '8':function(){
        this.name = "Trigger";
        this.message = `Ошибка Trigger. ${Object.values(arguments).join()}`;
    },
    '9':function(){
        this.name = "FewResources";
        this.message = `Ошибка FewResources. ${Object.values(arguments).join()}`;
    },
    '10':function(){
        this.name = "NoFunds";
        this.message = `Ошибка NoFunds. ${Object.values(arguments).join()}`;
    },
    '11':function(){
        this.name = "Data";
        this.message = `Ошибка Data. ${Object.values(arguments).join()}`;
    },
    '12':function(){
        this.name = "MissingVariable";
        this.message = `Ошибка MissingVariable. ${Object.values(arguments).join()}`;
    },
    '13':function(){
        this.name = "ObjectLocked";
        this.message = `Объект заблокировн для редактирования. ${Object.values(arguments).join()}`;
    },
    '14':function(){
        this.name = "InvoiceLineAlresdyUsed";
        this.message = `Ошибка InvoiceLineAlresdyUsed. ${Object.values(arguments).join()}`;
    },
    '15':function(){
        this.name = "Invoiced";
        this.message = `Cчет уже выставлен. ${Object.values(arguments).join()}`;
    },
    '16':function() {
        this.name = "ObjectBlocked";
        this.message = `Объект заблокирован. ${Object.values(arguments).join()}`;
    },
    '17':function(){
        this.name = "Obsolete";
        this.message = `Ошибка Obsolete. ${Object.values(arguments).join()}`;
    },
    '18':function(){
        this.name = "IncorrectBlockMode";
        this.message = `Такой тип блокировки уже существует. ${Object.values(arguments).join()}`;
    },
    '19':function(){
        this.name = "IncorrectBlockDate";
        this.message = `Неверная дата блокирвоки. ${Object.values(arguments).join()}`;
    },
    '20':function(){
        this.name = "IncorrectBlockOutdated";
        this.message = `Дата блокировки уже устарела. ${Object.values(arguments).join()}`;
    },
    '21':function(){
        this.name = "FilesizeExceeded";
        this.message = `Превышен максимальный размер файла. ${Object.values(arguments).join()}`;
    },
    '22':function(){
        this.name = "QueueExceeded";
        this.message = `Очередь переполнена. ${Object.values(arguments).join()}`;
    },
    '23':function(){
        this.name = "DublicateField";
        this.message = `Ошибка DublicateField. ${Object.values(arguments).join()}`;
    },
    '24':function(){
        this.name = "ExcludingField";
        this.message = `Ошибка ExcludingField. ${Object.values(arguments).join()}`;
    },
    '25':function(){
        this.name = "UnknownField";
        this.message = `Ошибка UnknownField. ${Object.values(arguments).join()}`;
    },
    '26':function(){
        this.name = "UnknownArgument";
        this.message = `Ошибка UnknownArgument. ${Object.values(arguments).join()}`;
    },
    '27':function(){
        this.name = "BillingAlreadyStarted";
        this.message = `Биллинг уже запущен. ${Object.values(arguments).join()}`;
    },
    '28':function(){
        this.name = "BalanceAboveZero";
        this.message = `У клиента не нулевой баланс (нельзя удалить). ${Object.values(arguments).join()}`;
    },
    '29':function(){
        this.name = "HasSubscribe";
        this.message = `Ошибка HasSubscribe. ${Object.values(arguments).join()}`;
    },
    '30':function(){
        this.name = "ForbiddenValue";
        this.message = `Запрещенное значенине. ${Object.values(arguments).join()}`;
    },
    '31':function(){
        this.name = "NegativeAmount";
        this.message = `Ошибка negative_amount. ${Object.values(arguments).join()}`;
    },
    '32':function(){
        this.name = "StackOverflow";
        this.message = `Cкорее всего последовательность созданных правил вызвала бесконечный цикл. ${Object.values(arguments).join()}`;
    },
    '33':function(){
        this.name = "InvalidStatus";
        this.message = `Неверный статус. ${Object.values(arguments).join()}`;
    },
    '34':function(){
        this.name = "NoFundsRevenues";
        this.message = `Средства не поступали. ${Object.values(arguments).join()}`;
    },
    '35':function(){
        this.name = "BlockLicence";
        this.message = `Лицензия заблокирована. ${Object.values(arguments).join()}`;
    },
    '36':function(){
        this.name = "MaximumClients";
        this.message = `Максимальное число килентов. ${Object.values(arguments).join()}`;
    },
    '37':function(){
        this.name = "VarIsUsed";
        this.message = `Значение используется. ${Object.values(arguments).join()}`;
    },
};
Object.keys(exceptions).forEach((key,i)=>{
    util.inherits(exceptions[key], Error);
});

module.exports = PP;