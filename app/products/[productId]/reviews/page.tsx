export default async function ({
    params,
}: {
    params: Promise<{ reviewId: string }>
}) {
    return (
        <div>
            <h1>Reviews</h1>
            <ol>
                <li>This is a good product </li>
                <li>I like this product so much </li>
            </ol>

        </div>
    )
}