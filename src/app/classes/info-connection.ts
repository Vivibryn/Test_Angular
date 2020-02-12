import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { LocalInitFile, UrlParam, DataSnapResult } from "./json-interface";

/**
 * Methode simplifier pour se connecter au serveur datasnap
 */
export class ArmaServConnection {

    private static localFileArmaorJSON: LocalInitFile; // Donnée enregistrer en local apres la premiere connection

    public static GET(http: HttpClient, methodName: string, argument: any[] = null): Observable<any> {
        let subject: Subject<any> = new Subject;
        this.getArmaorJson(http).then(json => {
            let infoConnection = new InfoConnection(http, json.ARMASERV_IP, json.ARMASERV_PORT);
            infoConnection.GETFunction(methodName, argument).subscribe(
                next => subject.next(next),
                error => subject.error(error),
                () => subject.complete()
            );
        })
        /*http.get('/armaor.json').subscribe(data => {
            let DATASNAP_IP_ADRESS = (data as LocalInitFile).ARMASERV_IP;
            let DATASNAP_PORT = (data as LocalInitFile).ARMASERV_PORT;
            let infoConnection = new InfoConnection(http, DATASNAP_IP_ADRESS, DATASNAP_PORT);
            if (argument == null) argument = [];
            infoConnection.GETFunction(methodName, argument).subscribe(
                next => subject.next(next),
                error => subject.error(error),
                () => subject.complete()
            );
        });*/
        return subject.asObservable();
    }

    public static POST(http: HttpClient, methodName: string, body: any, argument: any[] = null): Observable<any> {
        let subject: Subject<any> = new Subject;
        this.getArmaorJson(http).then(json => {
            let infoConnection = new InfoConnection(http, json.ARMASERV_IP, json.ARMASERV_PORT);
            infoConnection.POSTFunction(methodName, body, argument).subscribe(
                next => subject.next(next),
                error => subject.error(error),
                () => subject.complete()
            );
        });
        return subject.asObservable();
    }

    public static navigate(http: HttpClient, methodName: string, valArg: any[], arrayUrlParams?: UrlParam[]) {
        let urlParam = '';
        if (arrayUrlParams) {
            for (let i = 0; i < arrayUrlParams.length; i++) {
                let param = arrayUrlParams[i];
                urlParam += (i == 0 ? '?' : '&') + param.name + '=' + param.value + '';
            }
        }
        http.get('/armaor.json').subscribe(data => {
            let DATASNAP_IP_ADRESS = (data as LocalInitFile).ARMASERV_IP;
            let DATASNAP_PORT = (data as LocalInitFile).ARMASERV_PORT;
            let infoConnection = new InfoConnection(http, DATASNAP_IP_ADRESS, DATASNAP_PORT);
            infoConnection.navigateTo(methodName, valArg, urlParam);
        });
    }

    public static showFile(http: HttpClient, filePath: string, fileName: string, downloadFile: boolean = false, changePage: boolean = true) {
        let paramPath = this.createUrlParam('filePath', filePath);
        let paramMIME = this.createUrlParam('MIME', this.getMIMEFromFile(filePath));
        let paramName = this.createUrlParam('filename', '"' + fileName + '"');

        console.log('paramMIME', paramMIME);

        let urlParam = this.prepareHTMLparam([paramPath, paramMIME]);
        if (downloadFile || paramMIME.value == 'application/octet-stream')
            urlParam = this.prepareHTMLparam([paramPath, paramMIME, paramName]);
        console.log('PARAM: ', urlParam);
        http.get('/armaor.json').subscribe(data => {
            let DATASNAP_IP_ADRESS = (data as LocalInitFile).ARMASERV_IP;
            let DATASNAP_PORT = (data as LocalInitFile).ARMASERV_PORT;
            let infoConnection = new InfoConnection(http, DATASNAP_IP_ADRESS, DATASNAP_PORT);
            infoConnection.navigateTo('GetFile', [], urlParam, changePage);
        });
    }

    public static async prepareZipFile(http: HttpClient, idLoggedUser: string, fileName: string, arrayFilePath: string[]): Promise<string> {
        let json = await this.getArmaorJson(http);
        let infoConnection = new InfoConnection(http, json.ARMASERV_IP, json.ARMASERV_PORT);
        let dataSnapResult = await infoConnection.POSTFunction('CreateZip', arrayFilePath, [idLoggedUser]).toPromise();
        return (dataSnapResult as DataSnapResult).result[0];
    }

    public static prepareHTMLparam(params: UrlParam[]): string {
        if (!params) return '';
        let urlParam = '';
        for (let i = 0; i < params.length; i++) {
            urlParam += (i == 0 ? '?' : '&') + params[i].name + '=' + params[i].value + '';
        }
        return urlParam;
    }

    /**
     * Lit le fichier local et retourne un json du fichier armaor.json du programme.
     * Si les donnée n'existe pas alors recupere et enregistre avec une requette http.
     */
    public static async getArmaorJson(http: HttpClient): Promise<LocalInitFile> {
        if (this.localFileArmaorJSON) return this.localFileArmaorJSON;
        let promise = await http.get<LocalInitFile>('/armaor.json').toPromise();
        if (promise) this.localFileArmaorJSON = promise;
        return promise;
    }

    /**
     * Envoie une requette http pour recuperer le fichier armaor.json du programme.
     * @deprecated Utiliser plutot getArmaorJson() pour eviter le trop d'appel sur HttpClient.
     */
    public static getFileArmarorJSON(http: HttpClient): Observable<LocalInitFile> {
        let subject: Subject<LocalInitFile> = new Subject;
        http.get('/armaor.json').subscribe(data => {
            subject.next((data as LocalInitFile));
            subject.complete();
        });
        return subject.asObservable();
    }

    public static createUrlParam(paramName: string, paramValue: string): UrlParam {
        return { name: paramName, value: paramValue }
    }

    public static getUrlParamFileName(fileName: string): UrlParam {
        return { name: 'filename', value: fileName };
    }

    /**
     * Split le fichier donnée pour recuperer la fin du fichier .xxx afin de determiner le type de page html a afficher
     * @param fileName fileName avec ou sans folder
     * https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
     */
    public static getMIMEFromFile(fileName: string): string {
        let result = 'application/octet-stream';
        let splitFileName = fileName.split('.');
        if (splitFileName.length > 0) {
            switch (splitFileName[splitFileName.length - 1]) {
                case 'jpg': return 'image/jpeg';
                case 'bmp': return 'image/bmp';
                case 'pdf': return 'application/pdf';
                case 'zip': return 'application/zip';
                // ......
            }
        }
        return result;
    }

    /**
     * Prépare et retourne l'url pour se connecter a armaserv
     * @param http 
     * @param methodeName 
     * @param arg 
     */
    public static async createUrlArmaServ(http: HttpClient, methodeName: string, arg: any[]) {
        let json = await this.getArmaorJson(http);
        return new InfoConnection(http, json.ARMASERV_IP, json.ARMASERV_PORT).getFullPath(methodeName, arg);
    }

    /**
     * Passe le chemin d'un fichier et retourne le nom du fichier seul
     */
    public static getFileNameFromPath(path: string) {
        let filename = '';
        if (path) filename = path.replace(/^.*[\\\/]/, '')        
        return filename;
    }

    public static async getFactoryName(http: HttpClient): Promise<string> {
        let factoryName = sessionStorage.getItem('FactoryName');
        if (!factoryName) {
            try {
                let val: DataSnapResult = await ArmaServConnection.GET(http, 'GetFactoryName').toPromise();
                factoryName = val.result[0] ? val.result[0] : '';
                sessionStorage.setItem('FactoryName', factoryName);
            } catch (error) {
                console.error(error);
            }                    
        }
        return factoryName;
    }
}

export class InfoConnection {

    // Pour indiquer que l'on va envoyer du json au server datasnap
    AditionalPostRequestOptions = {
        headers: new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'text/plain;charset=UTF-8'
        })
    };

    AditionalPostOctetStreamOption = {
        headers: new HttpHeaders({
            'Accept': 'application/octet-stream',
            'Content-Type': 'application/octet-stream'
        })
    };

    static DefaultPath = 'datasnap/rest';           // 
    static DefaultComponent = 'TServerMethods';     // Chemin pour acceder a la class conteant la liste des fonctions

    private mHttp: HttpClient;
    private mAdresseIp: String;
    private mPort: String;
    private mPath: String;
    private mComponent: String;

    constructor(http: HttpClient, adresseIp: String, port: String) {
        this.mHttp = http;
        this.mAdresseIp = adresseIp;
        this.mPort = port;
        this.mPath = InfoConnection.DefaultPath;
        this.mComponent = InfoConnection.DefaultComponent;
    }

    /**
     * Retourne le chemin d'acces vers arma serv 
     * avec la methode et les arguments passées en param
     * IP / PORT / CLASS / METHODENAME / ARG1 / ARG2
     * @param methodeName 
     * @param paramName 
     */
    public getFullPath(methodeName: string, paramName: any[]): string {
        let rValue: string = this.getUrlMethodePath(methodeName);
        if (paramName != null) {
            paramName.forEach(element => {
                rValue = rValue + element + '/';
            });
        }
        return rValue;
    }

    public getUrlMethodePath(methodeName: string) {
        let rValue: string = '';
        rValue = rValue + 'http://' + this.mAdresseIp + ':' + this.mPort + '/' + this.mPath + '/' + this.mComponent + '/' + methodeName + '/';
        console.log('Call: ' + rValue);
        return rValue;
    }

    public GETFunction(nomFonction: string, valArg: any[]): Observable<Object> | undefined {
        if (nomFonction != null) {
            return this.mHttp.get(this.getFullPath(nomFonction, valArg));
        } else {
            console.error('generateInfoConnection', 'nomFonction = null');
        }
        return undefined;
    }

    public POSTFunction(methodName: string, body: any, valArg: any[] = null): Observable<Object> | undefined {
        //nomFonction = nomFonction.replace('update', ''); // diminutif des fonctions post en delphi
        if (methodName != null) {
            //console.log(body);
            if (valArg == null) {
                return this.mHttp.post(this.getUrlMethodePath(methodName), body, this.AditionalPostRequestOptions); //                    
            } else {
                return this.mHttp.post(this.getFullPath(methodName, valArg), body, this.AditionalPostRequestOptions); //
            }
        } else {
            console.error('generateInfoConnection', 'methodName = null');
        }
        return undefined;
    }

    /**
     * Renvois vers une page web spécifique
     * @param methodName 
     * @param valArg 
     * @param valUrlParam 
     */
    public navigateTo(methodName: string, valArg: any[], valUrlParam?: string, changePage: boolean = true) {
        if (!valUrlParam) valUrlParam = '';
        if (methodName != null) {
            if (changePage) window.open(this.getFullPath(methodName, valArg) + valUrlParam);
            else            window.location.href = this.getFullPath(methodName, valArg) + valUrlParam;            
            //this.mHttp.get(this.getFullPath(nomFonction, valArg)).subscribe(val => this.getDataSnapJson(val.json()));
        }
    }
}