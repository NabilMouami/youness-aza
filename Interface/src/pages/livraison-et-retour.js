// pages/livraison-et-retour.js

import Head from "next/head";
import Layout from "@/components/layout/Layout";

const LivraisonEtRetour = () => {
  return (
    <>
      <Head>
        <title>Livraison et Retour - Ma Chaussure</title>
        <meta name="description" content="Livraison et Retour information" />
      </Head>
      <Layout headerStyle={3} footerStyle={1}>
        <div className="container my-5">
          <h1 className="text-center mb-4">Livraison et Retour</h1>

          <div className="row">
            <div className="col-md-12">
              <h2 className="text-decoration-underline text-success">
                Livraison:
              </h2>
              <p>
                Nous livrons dans tout le Maroc en collaboration avec notre
                partenaire de confiance Amana. Le délai de livraison est
                généralement de 2 à 5 jours ouvrables, selon votre emplacement.
                Les frais de livraison varient en fonction du montant de votre
                commande et sont calculés au moment du paiement.
              </p>

              <h3 className="text-decoration-underline text-success">
                Délais et coûts:
              </h3>
              <ul>
                <li>Livraison standard : 2 à 5 jours ouvrables</li>
                <li>Livraison express : 1 à 2 jours ouvrables (supplément)</li>
              </ul>

              <h3 className="text-decoration-underline text-success">
                Suivi de commande:
              </h3>
              <p>
                Une fois votre commande expédiée, vous recevrez un email avec
                les détails de suivi. Vous pouvez suivre votre commande
                directement sur le site d’Amana en utilisant votre numéro de
                suivi.
              </p>

              <h2 className="text-decoration-underline text-success">
                Retour:
              </h2>
              <p>
                Si vous n'êtes pas satisfait de votre achat, vous pouvez
                retourner les articles dans un délai de 15 jours après réception
                de votre commande. Les articles retournés doivent être en
                parfait état, non portés et dans leur emballage d'origine.
              </p>

              <h3 className="text-decoration-underline text-success">
                Procédure de retour:
              </h3>
              <p>
                Pour retourner un article, veuillez nous contacter via notre
                formulaire de contact ou envoyer un email à notre service
                client. Nous vous fournirons l'adresse de retour et les étapes à
                suivre pour effectuer le retour.
              </p>

              <h3 className="text-decoration-underline text-success">
                Remboursement:
              </h3>
              <p>
                Une fois les articles reçus et inspectés, nous procéderons au
                remboursement via le même moyen de paiement utilisé lors de
                l'achat. Le délai de remboursement est généralement de 7 à 10
                jours ouvrables.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default LivraisonEtRetour;
