"use strict";
/*
    API � http://docs.priceplan.ru
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
        this.message = `��������� ����������� ������`;
     },
    '1':function(){
        this.name = "Duplicate";
        this.message = `�������� ��������`;
    },
    '2':function(){
        this.name = "EmptyValue";
        this.message = `������ ���������`;
    },
    '3':function(){
        this.name = "InvalidArgument";
        this.message = `������������ ��������`;
    },
    '4':function(){
        this.name = "MissingArgument";
        this.message = `�� ������ ��������`;
    },
    '5':function(){
        this.name = "InvalidData";
        this.message = `������������ ������`;
    },
    '6':function(){
        this.name = "ObjectNotFound";
        this.message = `������ �� ������`;
    },
    '7':function(){
        this.name = "BadRequest";
        this.message = `�������� ������`;
    },
    '8':function(){
        this.name = "Trigger";
        this.message = `������ Trigger`;
    },
    '9':function(){
        this.name = "FewResources";
        this.message = `������ FewResources`;
    },
    '10':function(){
        this.name = "NoFunds";
        this.message = `������ NoFunds`;
    },
    '11':function(){
        this.name = "Data";
        this.message = `������ Data`;
    },
    '12':function(){
        this.name = "MissingVariable";
        this.message = `������ MissingVariable`;
    },
    '13':function(){
        this.name = "ObjectLocked";
        this.message = `������ ����������� ��� ��������������`;
    },
    '14':function(){
        this.name = "InvoiceLineAlresdyUsed";
        this.message = `������ InvoiceLineAlresdyUsed`;
    },
    '15':function(){
        this.name = "Invoiced";
        this.message = `C��� ��� ���������`;
    },
    '16':function(){
        this.name = "ObjectBlocked";
        this.message = `������ ������������`;
    },
    '17':function(){
        this.name = "Obsolete";
        this.message = `������ Obsolete`;
    },
    '18':function(){
        this.name = "IncorrectBlockMode";
        this.message = `����� ��� ���������� ��� ����������`;
    },
    '19':function(){
        this.name = "IncorrectBlockDate";
        this.message = `�������� ���� ����������`;
    },
    '20':function(){
        this.name = "IncorrectBlockOutdated";
        this.message = `���� ���������� ��� ��������`;
    },
    '21':function(){
        this.name = "FilesizeExceeded";
        this.message = `�������� ������������ ������ �����`;
    },
    '22':function(){
        this.name = "QueueExceeded";
        this.message = `������� �����������`;
    },
    '23':function(){
        this.name = "DublicateField";
        this.message = `������ DublicateField`;
    },
    '24':function(){
        this.name = "ExcludingField";
        this.message = `������ ExcludingField`;
    },
    '25':function(){
        this.name = "UnknownField";
        this.message = `������ UnknownField`;
    },
    '26':function(){
        this.name = "UnknownArgument";
        this.message = `������ UnknownArgument`;
    },
    '27':function(){
        this.name = "BillingAlreadyStarted";
        this.message = `������� ��� �������`;
    },
    '28':function(){
        this.name = "BalanceAboveZero";
        this.message = `� ������� �� ������� ������ (������ �������)`;
    },
    '29':function(){
        this.name = "HasSubscribe";
        this.message = `������ HasSubscribe`;
    },
    '30':function(){
        this.name = "ForbiddenValue";
        this.message = `����������� ���������`;
    },
    '31':function(){
        this.name = "NegativeAmount";
        this.message = `������ negative_amount`;
    },
    '32':function(){
        this.name = "StackOverflow";
        this.message = `C����� ����� ������������������ ��������� ������ ������� ����������� ����`;
    },
    '33':function(){
        this.name = "InvalidStatus";
        this.message = `�������� ������`;
    },
    '34':function(){
        this.name = "NoFundsRevenues";
        this.message = `�������� �� ���������`;
    },
    '35':function(){
        this.name = "BlockLicence";
        this.message = `�������� �������������`;
    },
    '36':function(){
        this.name = "MaximumClients";
        this.message = `������������ ����� ��������`;
    },
    '37':function(){
        this.name = "VarIsUsed";
        this.message = `�������� ������������`;
    },
};
Object.keys(exceptions).forEach((key,i)=>{
    util.inherits(exceptions[key], Error);
});

module.exports = PP;