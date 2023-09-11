import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Map from "../components/Map";


export default function Home() {
  const [coordinates, setCoordinates] = useState({
    lat: 2.996576908645812,
    lng: 101.59493478782426,
  });
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-100 h-100">
        <Map></Map>
      </main>
    </div>
  );
}
