import Link from "next/link";
import Image from "next/image";
export default function Footer1() {
  return (
    <>
      <footer>
        <div className="footer-area theme-bg pt-25">
          <div className="container">
            <div className="main-footer pb-15 mb-30">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-1 mb-40">
                    <div className="footer-logo">
                      <Link href="/">
                        <Image
                          src="/assets/img/logo/logo.webp"
                          alt="logo"
                          width={100}
                          height={100}
                        />
                      </Link>{" "}
                    </div>
                    <div className="footer-content">
                      <p>
                        Nous proposons uniquement des produits authentiques et
                        notre équipe d'experts vérifie toutes nos baskets. Tous
                        nos employés sont de véritables fanatiques de baskets !
                        Vous en faites partie également ? Jetez un œil et
                        essayons ensemble ! Commandé avant 18h00 = Expédié
                        aujourd'hui !
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-2 ml-30 mb-40">
                    <h4 className="footer-widget__title mb-30">Lien Utiles</h4>
                    <div className="footer-widget__links">
                      <ul>
                        <li>
                          <a href="/on-sale">Sale</a>
                        </li>
                        <li>
                          <a href="/collections/accessoire">Accessoires</a>
                        </li>
                        <li>
                          <a href="/collections/sneakers">Sneakers</a>
                        </li>
                        <li>
                          <a href="/blog">Blog</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-3 mb-40">
                    <h4 className="footer-widget__title mb-30">
                      Service Client
                    </h4>
                    <div className="footer-widget__links">
                      <ul>
                        <li>
                          <Link href="/modes-de-paiement">
                            Modes de paiement
                          </Link>
                        </li>
                        <li>
                          <Link href="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link href="/frais-de-livraison">
                            Frais De Livraison
                          </Link>
                        </li>
                        <li>
                          <Link href="/livraison-et-retour">
                            Politique d'échange
                          </Link>
                        </li>
                        <li>
                          <Link href="/reclamation-coins">Reglement Coins</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-6">
                  <div className="footer-widget footer-col-4 mb-40">
                    <h4 className="footer-widget__title mb-30">
                      Social Network
                    </h4>
                    <div className="footer-widget__links">
                      <ul>
                        <li>
                          <Link
                            href="https://www.facebook.com/yazasnkrz/"
                            target="_blank"
                          >
                            <i className="fab fa-facebook-f" />
                            Facebook
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="https://www.instagram.com/yaza_snkrz/"
                            target="_blank"
                          >
                            <i className="fab fa-instagram" />
                            Instagram
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="https://www.tiktok.com/@yaza_snkrz"
                            target="_blank"
                          >
                            <i className="fab fa-tiktok" />
                            TikTok
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4">
                  <div className="footer-widget footer-col-5 mb-40">
                    <h4 className="footer-widget__title mb-30">S'inscrire </h4>
                    <p>Recevez nos offres et actualités par email</p>
                    <div className="footer-widget__newsletter">
                      <form action="#">
                        <input type="email" placeholder="Enter email address" />
                        <button className="footer-widget__fw-news-btn tpsecondary-btn">
                          Subscribe Now
                          <i className="fal fa-long-arrow-right" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-cta pb-20">
              <div className="row justify-content-between align-items-center">
                <div className="col-xl-6 col-lg-4 col-md-4 col-sm-6">
                  <div className="footer-cta__contact">
                    <div className="footer-cta__icon">
                      <i className="far fa-phone" />
                    </div>
                    <div className="footer-cta__text">
                      <Link
                        href="https://wa.me/212626309597"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        +212 626 30 9597
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright footer-bg">
            <div className="container">
              <div className="row">
                <div className="col-xl-6 col-lg-7 col-md-5 col-sm-12">
                  <div className="footer-copyright__content">
                    <span>
                      Copyright {new Date().getFullYear()}
                      <span className="fw-bold text-black"> ©YazaSneakers</span>
                      . All rights reserved.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
