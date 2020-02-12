/**
 * Contenu du fichier armaor.json
 */
export interface LocalInitFile {
  ARMASERV_IP: string;
  ARMASERV_PORT: string;
};

/**
 * Quand on appel la fonction :
 *  'Login' en POST
 */
export interface ResultLogin {
  result: [
    {
      ID_LOGGED: string,      // Json contiens l'identifiant de la connection lors du resultat du login
      // Droit d'utilisation
      RightOverview: number,
      RightCertif: number,
      RightDeliveryList: number,
      RightWebInput: number,
      RightInvoiceList: number,
      RightOrderList: number,
      RightDataList: number,
      RightSupervisor: number,
      RightQueryEditor: number,
      Dashboard: DashBoard[]
    }
  ]
};

export interface DataSnapResultChantier {
  result: [Chantier[]]
};

export interface Chantier {
  CODECHANTIER: string
};

/**
 * Retour typique lors de l'appel d'un fonction DataSnap Rest
 * 'result[0]'  - quand la methode a fonctionne
 * 'error'      - quand la methode appeler retourne une erreure (throw)
 */
export interface DataSnapResult {
  result: [any],
  error: string
};

export interface DataSnapResultBasicDataValue {
  result: [
    [
      {
        Data: string,
        Value: string
      }
    ]
  ]
};

export interface DataSnapResultCertificats {
  result: [Certificate[]]
};

export interface Point {
  X: number, Y: number
};

export interface Rect {
  left: number,
  top: number,
  right: number,
  bottom: number
};

export interface Vecteur {
  X: number, Y: number, Z: number
};

export interface RightUser {
  RightShowOverview: boolean,
  RightShowWebInput: boolean,
  RightShowOrderList: boolean,
  RightShowDeliveryList: boolean,
  RightShowCertif: boolean,
  RightShowInvoiceList: boolean,
  RightDataList: boolean,
  RightSupervisor: boolean,
  RightQueryEditor: boolean
};

export interface HomeScreenElement {
  visible: boolean,                       //
  title: string,
  imageSrc: string,
  content: string,
  onClickEventName: string,
  ID: string,                             // Premet d'identifier l'id du dashboard
  subButton: HomeScreenElementSubButton[] // 
}

export interface HomeScreenElementSubButton {
  name: string,
  onClickEventName: string
}
  
export interface Certificate {
  DOC_NAME: string, // Nom du fichier
  DOC_PATH: string  // Chemin du fichier à telecharger
}

export interface Order {
  CreationDate: string,
  Delivery: string,
  Drawing: string,
  OrderCode: string,
  PersonInCharge: string,
  PlannedDelivDate: string,
  Production: string,
  Weight: string
}

export interface UrlParam {
  name: string,
  value: string
}

export interface Grade {
  Name: string,
  ShortName: string,
  Code: string,
  Default: number
}

export interface DashBoard {
  Name: string,
  NoDash: number,
  Count: number
}

export interface ErrorLineDec {
  NoLine: number, 
  Mess: string,
  IsBlocking: number
}