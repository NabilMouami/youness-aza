"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import Confetti from "react-confetti";

const SuccessPage = () => {
  const { cart } = useSelector((state) => state.shop);
  const searchParams = useSearchParams();
  const router = useRouter();
  const total = useMemo(() => {
    const sum =
      cart?.reduce((acc, data) => {
        const price =
          data.item.price_promo !== 0 ? data.item.price_promo : data.item.price;
        return acc + price;
      }, 0) || 0;

    return sum < 1000 ? sum + 50 : sum;
  }, [cart]);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex flex-column gap-3 align-items-center justify-content-center text-center">
        <Stack spacing={2} useFlexGap>
          <Typography variant="h1">📦</Typography>
          <Typography variant="h5">Merci pour votre commande !</Typography>
          <Typography variant="body1" color="text.secondary">
            Nous vous avons envoyé un e-mail de confirmation de votre commande
            et vous tiendrons au courant dès qu'elle sera expédiée.
          </Typography>
        </Stack>
      </div>
      <div className="d-flex flex-column gap-3 align-items-center justify-content-center text-center mt-30">
        <Button
          variant="contained"
          sx={{
            alignSelf: { xs: "center", sm: "start" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Link href="/my-orders">Accéder à mes commandes</Link>
        </Button>
      </div>

      <div className="w-100 d-flex flex-column gap-3 align-items-center justify-content-center text-center">
        <Confetti width={window.innerWidth} height={window.innerHeight} />
        <h1 className="text-success display-1">Successful</h1>
        <h2 className="h4 fw-bold">
          Nous vous avons envoyé la facture par e-mail
        </h2>
        <h2 className="h4 fw-bold">Vous gagnez {total / 2.5} Coins.</h2>
        <Alert severity="info">
          Les Coins seront disponibles 30 jours après le paiement.
        </Alert>

        <h3>Vous êtes redirigé vers la page de commande...</h3>
      </div>
    </div>
  );
};

export default SuccessPage;
