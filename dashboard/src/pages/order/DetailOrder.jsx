import { Fragment, useState, useEffect } from "react";
import {
  RiMailAddFill,
  RiPhoneFill,
  RiUser2Fill,
  RiUser2Line,
  RiGpsFill,
  RiSignpostFill,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import axios from "axios";
import { config_url } from "../../config";

function DetailOrder() {
  const [listOrders, setListOrders] = useState([]);
  console.log(listOrders);

  const Detail = useSelector((state) => state.Load);
  const { Col } = Detail;
  let date_order = "2024-07-07 13:50";
  useEffect(() => {
    axios
      .get(`${config_url}/api/orders/date_order/${Col.date_order}`)
      .then(async (res) => {
        await setListOrders(res.data);
      });
  }, []);
  return (
    <Fragment>
      <div className="user">
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowBottom">
              <span className="userShowTitle">Nom Complete du client</span>
              <div className="userShowInfo">
                <RiUser2Fill className="userShowIcon" />
                <span className="userShowInfoTitle">{Col.nom_client}</span>
              </div>
              <span className="userShowTitle">Détails du contact</span>
              <div className="userShowInfo">
                <RiMailAddFill className="userShowIcon" />
                <span className="userShowInfoTitle">{Col.email}</span>
              </div>
              <div className="userShowInfo">
                <RiPhoneFill className="userShowIcon" />
                <span className="userShowInfoTitle">{Col.telephone}</span>
              </div>
              <div className="userShowInfo">
                <RiPhoneFill className="userShowIcon" />
                <span className="userShowInfoTitle">{Col.ville}</span>
              </div>
              <div className="userShowInfo">
                <RiGpsFill className="userShowIcon" />
                <span className="userShowInfoTitle">{Col.adresse}</span>
              </div>
              <div className="userShowInfo">
                <RiSignpostFill className="userShowIcon" />
                <span className="userShowInfoTitle">{Col.code_postal}</span>
              </div>
            </div>
          </div>
          {listOrders.map((item) => (
            <div key={item.prod_id} className="userUpdate">
              <span className="userUpdateTitle">Details de Produit</span>
              <form className="userUpdateForm">
                <div className="userUpdateLeft">
                  <span className="font-bold text-xl font-sans">
                    {item.name}
                  </span>

                  <div className="userUpdateItem">
                    <img
                      src={`${config_url}/images/${item.image}`}
                      alt={item.name}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="mt-10 text-black font-sans items-center">
                    <div>
                      Price Ordered:
                      <span className="font-semibold text-xl">
                        {item.total_price} Dh
                      </span>{" "}
                    </div>
                    <div>
                      Item(s) Ordered:
                      <span className="font-semibold text-xl">
                        {item.items}
                      </span>{" "}
                    </div>
                    <div>
                      Size Ordered:
                      <span className="font-semibold text-xl">
                        {item.size}
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default DetailOrder;
