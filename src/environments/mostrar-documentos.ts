import firebase from 'firebase/compat/app';

export const retornarDocumentos = (snapshot:firebase.firestore.QuerySnapshot) =>{

    const documentos: any[] = [];
      snapshot.forEach( snapHijo =>{
        documentos.push({
          id : snapHijo.id,
          ...snapHijo.data()
        });
      });
      console.log(documentos);
      return documentos;
    }
