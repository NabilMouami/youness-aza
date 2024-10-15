import Layout from "@/components/layout/Layout";
import Link from "next/link";
export default function Contact() {
  return (
    <>
      <Layout headerStyle={3} footerStyle={1}>
        <div>
          <section className="contact-area pt-80 pb-80">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-12">
                  <div className="tpcontact__right mb-40">
                    <div className="tpcontact__shop mb-30">
                      <h4 className="tpshop__title mb-25">
                        Contact Information
                      </h4>
                      <div className="tpshop__info">
                        <ul>
                          <li>
                            <i className="fal fa-map-marker-alt" /> Casablanca ,
                            Morocco
                          </li>
                          <li>
                            <i className="fal fa-phone" />
                            <Link href="/tel:0123456789">+212 626 30 9597</Link>
                          </li>
                          <li>
                            <i className="fal fa-envelope" />
                            yazasnkrz@outlook.com
                          </li>
                          <li>
                            <i className="fal fa-clock" />
                            <span>Store Hours:</span>
                            <span>24/24</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
