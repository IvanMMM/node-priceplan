"use strict";
/*
    API к http://docs.priceplan.ru
 */

const util = require("util");
const crypto = require('crypto');
const qs = require('querystring');
const rp = require('request-promise');

class PP{
    constructor(baseurl,user,key){
        if(!baseurl) throw new Error(`Invalid URL`);
        if(!user) throw new Error(`Invalid User`);
        if(!key) throw new Error(`Invalid Key`);

        this._baseurl = baseurl;
        this._user = user;
        this._key = key;

        this.baseParams = {
            user:this._user
        };
    }

    sign(params={}){
        if(typeof params !== 'object') throw new TypeError(`Params must be an Object`);
        params = Object.assign({},this.baseParams,params);

        const ordered = {};
        Object.keys(params).sort().forEach(function(key) {
            ordered[key] = params[key];
        });

        ordered['token']=crypto.createHash('md5').update(qs.stringify(ordered)+this._key).digest("hex");
        return ordered;
    }

    get(endpoint,params,method='GET'){
        params = this.sign(params);
        return rp({
            url:`${this._baseurl}key/${endpoint}`,
            method:method,
            qs:params,
            json:true
        })
        .then(body=>{
            if(body.success===true) return body;
            throw new exceptions[body.errors[0].code.toString()]();
        })
    }
}

let exceptions = {
    '-1':function(){
        this.name = "Unknown";
        this.message = `Произошла неизвестная ошибка`;
     },
    '1':function(){
        this.name = "Duplicate";
        this.message = `Дубликат значения`;
    },
    '2':function(){
        this.name = "EmptyValue";
        this.message = `Пустое значенине`;
    },
    '3':function(){
        this.name = "InvalidArgument";
        this.message = `Некорректный аргумент`;
    },
    '4':function(){
        this.name = "MissingArgument";
        this.message = `Не указан аргумент`;
    },
    '5':function(){
        this.name = "InvalidData";
        this.message = `Некорректные данные`;
    },
    '6':function(){
        this.name = "ObjectNotFound";
        this.message = `Объект не найден`;
    },
    '7':function(){
        this.name = "BadRequest";
        this.message = `Неверный запрос`;
    },
    '8':function(){
        this.name = "Trigger";
        this.message = `Ошибка Trigger`;
    },
    '9':function(){
        this.name = "FewResources";
        this.message = `Ошибка FewResources`;
    },
    '10':function(){
        this.name = "NoFunds";
        this.message = `Ошибка NoFunds`;
    },
    '11':function(){
        this.name = "Data";
        this.message = `Ошибка Data`;
    },
    '12':function(){
        this.name = "MissingVariable";
        this.message = `Ошибка MissingVariable`;
    },
    '13':function(){
        this.name = "ObjectLocked";
        this.message = `Объект заблокировн для редактирования`;
    },
    '14':function(){
        this.name = "InvoiceLineAlresdyUsed";
        this.message = `Ошибка InvoiceLineAlresdyUsed`;
    },
    '15':function(){
        this.name = "Invoiced";
        this.message = `Cчет уже выставлен`;
    },
    '16':function(){
        this.name = "ObjectBlocked";
        this.message = `Объект заблокирован`;
    },
    '17':function(){
        this.name = "Obsolete";
        this.message = `Ошибка Obsolete`;
    },
    '18':function(){
        this.name = "IncorrectBlockMode";
        this.message = `Такой тип блокировки уже существует`;
    },
    '19':function(){
        this.name = "IncorrectBlockDate";
        this.message = `Неверная дата блокирвоки`;
    },
    '20':function(){
        this.name = "IncorrectBlockOutdated";
        this.message = `Дата блокировки уже устарела`;
    },
    '21':function(){
        this.name = "FilesizeExceeded";
        this.message = `Превышен максимальный размер файла`;
    },
    '22':function(){
        this.name = "QueueExceeded";
        this.message = `Очередь переполнена`;
    },
    '23':function(){
        this.name = "DublicateField";
        this.message = `Ошибка DublicateField`;
    },
    '24':function(){
        this.name = "ExcludingField";
        this.message = `Ошибка ExcludingField`;
    },
    '25':function(){
        this.name = "UnknownField";
        this.message = `Ошибка UnknownField`;
    },
    '26':function(){
        this.name = "UnknownArgument";
        this.message = `Ошибка UnknownArgument`;
    },
    '27':function(){
        this.name = "BillingAlreadyStarted";
        this.message = `Биллинг уже запущен`;
    },
    '28':function(){
        this.name = "BalanceAboveZero";
        this.message = `У клиента не нулевой баланс (нельзя удалить)`;
    },
    '29':function(){
        this.name = "HasSubscribe";
        this.message = `Ошибка HasSubscribe`;
    },
    '30':function(){
        this.name = "ForbiddenValue";
        this.message = `Запрещенное значенине`;
    },
    '31':function(){
        this.name = "NegativeAmount";
        this.message = `Ошибка negative_amount`;
    },
    '32':function(){
        this.name = "StackOverflow";
        this.message = `Cкорее всего последовательность созданных правил вызвала бесконечный цикл`;
    },
    '33':function(){
        this.name = "InvalidStatus";
        this.message = `Неверный статус`;
    },
    '34':function(){
        this.name = "NoFundsRevenues";
        this.message = `Средства не поступали`;
    },
    '35':function(){
        this.name = "BlockLicence";
        this.message = `Лицензия заблокирована`;
    },
    '36':function(){
        this.name = "MaximumClients";
        this.message = `Максимальное число килентов`;
    },
    '37':function(){
        this.name = "VarIsUsed";
        this.message = `Значение используется`;
    },
};
Object.keys(exceptions).forEach((key,i)=>{
    util.inherits(exceptions[key], Error);
});

module.exports = PP;