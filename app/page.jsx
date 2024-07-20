import Image from "next/image";

function apiCheck() {
	const FALLBACK_CONTENT_API =
		"https://ap-southeast-2.cdn.hygraph.com/content/clrz8qn8h1tpp01ut4upqlaip/master";
	if (
		process.env.HYGRAPH_CONTENT_API != null ||
		process.env.HYGRAPH_CONTENT_API != undefined
	) {
		return process.env.HYGRAPH_CONTENT_API;
	}
	return FALLBACK_CONTENT_API;
}
async function fetchSnackBouquet() {
	const snackBouquets = await fetch(apiCheck(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.HYGRAPH_AUTH_TOKEN}`,
		},
		next: { revalidate: 10 },
		body: JSON.stringify({
			query: `
				query SnackBouquets{
					products(where: {productCategory_contains: "Snack Bouquet"}, first:5) {
						productName
						productImage {
							imageFile{
								url
							}
						}
					}
				}
			`,
		}),
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));
	return snackBouquets.data.products;
}
export default async function Home() {
	const receivedSnackBouquets = await fetchSnackBouquet();
	return (
		<main className="flex min-h-screen flex-col items-center justify-start p-24">
			<h2 className="text-3xl font-semibold">Test Hygraph + Next.js 14</h2>
			<div className="flex max-w-screen-lg pt-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{receivedSnackBouquets.map((snackBouquet) => (
						<div
							className="size-full flex flex-col flex-wrap"
							key={`${snackBouquet.productName} card`}
						>
							<div className="w-32 h-32 relative">
								<Image
									src={snackBouquet.productImage.imageFile.url}
									alt={`Picture of product, ${snackBouquet.productName}`}
									style={{ objectFit: "cover", borderRadius: "12px" }}
									fill={true}
									placeholder="empty"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>
							</div>
							<div className="text-xl text-wrap">
								{snackBouquet.productName}
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
