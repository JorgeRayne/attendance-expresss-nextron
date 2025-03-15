import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";

export default function NextPage() {
    const [nfc_id, setNfc] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:15662/check-nfc",
                {
                    nfc_id,
                },
            );
            console.log(response);
        } catch (error) {
            console.log(error);
            console.log("ERROR BAI", error);
        }
    };
    return (
        <React.Fragment>
            <Head>
                <title>Next - Nextron (with-tailwindcss)</title>
            </Head>

            <form onSubmit={handleSubmit}>
                <input onChange={(e) => setNfc(e.target.value)} type="text" />

                <button className="">Submit</button>
            </form>

            <div className="mt-1 w-full flex-wrap flex justify-center">
                <Link href="/home">Go to home page</Link>
            </div>
        </React.Fragment>
    );
}

{
    /* <div className="grid grid-col-1 text-2xl w-full text-center">
<div>
    <Image
        className="ml-auto mr-auto"
        src="/images/logo.png"
        alt="Logo image"
        width={256}
        height={256}
    />
</div>
<span>⚡ Nextron ⚡</span>
</div> */
}
