// pages/livraison.js

import Head from "next/head";
import Layout from "@/components/layout/Layout";

const Livraison = () => {
  return (
    <>
      <Head>
        <title>Livraison - Yazasnkrz</title>
        <meta
          name="description"
          content="Informations sur les options de livraison de Yazasnkrz"
        />
      </Head>
      <Layout headerStyle={3} footerStyle={1}>
        <div className="container my-5">
          <h1 className="text-center mb-4">Livraison</h1>

          <div className="row">
            <div className="col-md-12">
              <h2 className="text-decoration-underline text-success">
                Expedition:
              </h2>
              <p>
                La livraison est assurée par un prestataire de service à
                l’adresse que vous spécifiez lors de votre commande où que vous
                soyez au Maroc. Les produits sont livrés à l'adresse de
                livraison indiquée au cours du processus de commande, dans un
                délai maximum de 30 jours calendaires à compter de la
                réalisation de l’achat. Toutes les commandes sont sujettes à une
                disponibilité du produit. En cas de difficultés concernant la
                livraison de la commande, ou si les articles sélectionnés ne
                sont pas en stock, le prix payé sera remboursé, le cas échéant.
                Les frais de transport pour les achats inférieurs à Mille cent
                (1000) Dirhams, sont à la charge du client. En cas de retard de
                livraison, vous bénéficiez de la possibilité d'annuler la
                commande dans les conditions de l'article 13 de la loi 31-08
                dictant les mesures de protection du consommateur. Nous mettons
                un point d'honneur, dans la mesure du possible, à expédier votre
                commande en un seul colis. Néanmoins, certaines exceptions nous
                contraignent parfois à vous livrer en plusieurs colis : - Votre
                commande ne peut pas tenir dans un seul colis et en nécessite
                plusieurs. - Votre commande contient des articles provenant de
                différents dépôts. Il convient de souligner que si la commande
                comprend des produits stockés dans différents dépôts, le service
                client vous appellera pour savoir quels sont les choix de
                livraison possibles et les options qui s'offrent à vous.
              </p>

              <h2 className="text-decoration-underline text-success">
                Frais de Livraison:
              </h2>
              <p>
                La livraison vous est offerte à partir de 1000 Dhs d’achat. Pour
                un montant d'achat inférieur à 1000 Dhs, les frais de livraison
                sont de 54 Dhs TTC. Pour toute autre information merci de
                contacter le service client : +212 626 30 9597
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Livraison;
