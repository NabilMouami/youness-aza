// pages/modes-de-paiement.js

import Head from "next/head";
import Layout from "@/components/layout/Layout";

const ModesDePaiement = () => {
  return (
    <>
      <Head>
        <title>Modes de Paiement - Yazasnkrz</title>
        <meta
          name="description"
          content="Modes de paiement disponibles sur Yazasnkrz"
        />
      </Head>
      <Layout headerStyle={3} footerStyle={1}>
        <div className="container my-5">
          <h1 className="text-center mb-4">Modes de Paiement</h1>

          <div className="row">
            <div className="col-md-12">
              <h2 className="text-decoration-underline text-success">
                Paiement par Carte Bancaire:
              </h2>
              <p>
                Nous acceptons les cartes bancaires Visa, MasterCard, et autres
                cartes émises par les banques marocaines ou internationales. Le
                paiement est entièrement sécurisé grâce à notre système de
                cryptage SSL, garantissant la confidentialité de vos
                informations bancaires.
              </p>

              <h3>Comment payer par carte bancaire?</h3>
              <ul>
                <li>
                  Étape 1: Choisissez vos produits et ajoutez-les à votre
                  panier.
                </li>
                <li>
                  Étape 2: Au moment du paiement, sélectionnez "Paiement par
                  carte bancaire".
                </li>
                <li>
                  Étape 3: Entrez les informations de votre carte bancaire et
                  validez la transaction.
                </li>
              </ul>

              <h2 className="text-decoration-underline text-success">
                Paiement à la Livraison:
              </h2>
              <p>
                Vous pouvez également choisir de payer en espèces à la
                livraison. Ce service est disponible dans la plupart des villes
                du Maroc. Un supplément peut s'appliquer pour cette option selon
                votre localisation.
              </p>

              <h3>Comment fonctionne le paiement à la livraison?</h3>
              <ul>
                <li>
                  Étape 1: Sélectionnez "Paiement à la livraison" lors de la
                  validation de votre commande.
                </li>
                <li>
                  Étape 2: Confirmez votre adresse et les frais éventuels.
                </li>
                <li>
                  Étape 3: Payez le montant total en espèces lorsque votre
                  commande vous est livrée.
                </li>
              </ul>

              <h2 className="text-decoration-underline text-success">
                Paiement par Virement Bancaire:
              </h2>
              <p>
                Pour les commandes importantes ou si vous préférez, vous avez
                également la possibilité de payer par virement bancaire. Une
                fois la commande validée, vous recevrez nos coordonnées
                bancaires pour effectuer le virement.
              </p>

              <h3>Instructions pour le virement bancaire:</h3>
              <ul>
                <li>
                  Étape 1: Sélectionnez "Paiement par virement bancaire" à la
                  fin de la commande.
                </li>
                <li>
                  Étape 2: Effectuez le virement en utilisant les coordonnées
                  bancaires fournies.
                </li>
                <li>
                  Étape 3: Envoyez-nous la preuve de virement pour traitement de
                  votre commande.
                </li>
              </ul>

              <h2 className="text-decoration-underline text-success">
                Sécurité et Protection des Paiements:
              </h2>
              <p>
                Nous accordons une grande importance à la sécurité de vos
                paiements. Tous les paiements effectués sur notre site sont
                sécurisés grâce à des systèmes de cryptage de pointe et des
                certifications internationales.
              </p>

              <h2 className="text-decoration-underline text-success">
                : الدفع عند الاستلام
              </h2>
              <p>
                الدفع عند الاستلام هو أحد وسائل الدفع المتاحة في متجرنا، ويعني
                الدفع عند الاستلام أن العميل يمكنه شراء المنتجات عبر متجرنا
                الإلكتروني واختيار المنتجات التي يرغب بها، ثم تقديم الطلب
                واختيار وسيلة الدفع عند استلام المنتج. مما يعني أن عملية الدفع
                مؤجلة حتى يتلقى العميل المنتج الذي طلبه عبر الإنترنت سنقوم
                بإرسال المنتج إلى المكان المتفق عليه (المدينة، الحي، المنزل أو
                موقع آخر)، ثم يمكن للعميل إتمام عملية الدفع
              </p>
              <h2 className="text-decoration-underline text-success">
                :الدفع عبر التحويل البنكي
              </h2>
              <p>
                يتم الدفع عن طريق تحويل المبلغ المستحق إلى حسابنا البنكي، أو عبر
                أحد فروع شركات تحويل الأموال بالاسم المتفق عليه، بعد إتمام
                التحويل، يتم إرسال المنتج إلى العنوان المحدد
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ModesDePaiement;
