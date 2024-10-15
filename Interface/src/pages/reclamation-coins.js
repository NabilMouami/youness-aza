import Head from "next/head";
import Layout from "@/components/layout/Layout";

const ReglementCoins = () => {
  return (
    <>
      <Head>
        <title>Règlement des Coins</title>
        <meta
          name="description"
          content="Reglement Cois Gagner Pour Paiement"
        />
      </Head>
      <Layout headerStyle={3} footerStyle={1}>
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-sm p-4">
                <h2 className="text-center mb-4">Règlement des Coins</h2>

                <h4 className="mb-3">1. Gagner des Coins</h4>
                <p>
                  <strong>Comment ça marche :</strong>
                  <ul>
                    <li>
                      Pour chaque <strong>250 DH</strong> dépensé sur le site,
                      vous gagnez
                      <strong> 100 coins</strong> (soit <strong>10 DH</strong>).
                    </li>
                    <li>
                      Exemple :
                      <ul>
                        <li>
                          <strong>1000 DH dépensé</strong> ={" "}
                          <strong>400 coins</strong>.
                        </li>
                        <li>
                          <strong>900 DH dépensé</strong> ={" "}
                          <strong>360 coins</strong>.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </p>

                <p>
                  <strong>Quand vous recevez vos coins :</strong>
                  <ul>
                    <li>
                      Les coins deviennent disponibles{" "}
                      <strong>30 jours après le paiement</strong>.
                    </li>
                    <li>
                      Exemple : Si vous passez une commande le{" "}
                      <strong>20/08/2024</strong> pour <strong>1000 DH</strong>,
                      avec une date de livraison prévue le
                      <strong> 21/08/2024</strong>, vos coins seront disponibles
                      à partir du <strong>21/09/2024</strong>.
                    </li>
                  </ul>
                </p>

                <h4 className="mb-3">2. Validité des Coins</h4>
                <p>
                  Les coins sont valides pour une durée de <strong>1 an</strong>{" "}
                  à partir de leur date de disponibilité. Passé ce délai, ils
                  expirent et ne pourront plus être utilisés.
                </p>

                <h4 className="mb-3">3. Utilisation des Coins</h4>
                <p>
                  <ul>
                    <li>
                      Les coins peuvent être utilisés comme méthode de paiement
                      lors du passage à la caisse.
                    </li>
                    <li>
                      Un maximum de <strong>60%</strong> du total du prix peut
                      être payé avec des coins.
                    </li>
                    <li>
                      Exemple : Si le total de votre panier est de{" "}
                      <strong>1000 DH</strong>, vous pouvez utiliser jusqu'à
                      <strong> 600 coins</strong> (soit <strong>60 DH</strong>)
                      pour réduire le prix.
                    </li>
                  </ul>
                </p>

                <h4 className="mb-3">4. Notes Importantes</h4>
                <p>
                  <ul>
                    <li>
                      Les coins ne sont <strong>pas remboursables</strong> et ne
                      peuvent être échangés contre de l'argent.
                    </li>
                    <li>
                      Si une commande est annulée ou retournée, les coins
                      utilisés ne seront pas recrédités.
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ReglementCoins;
