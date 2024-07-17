export const calculatePrice = ({
    price,
    quantity,
    gst,
    discount = 0,
}: {
    price: number;
    quantity: number;
    gst: number;
    discount?: number;
}) => {
    const discountedPrice = price * (1 - discount / 100);
    const gstAmount = discountedPrice * (gst / 100);
    const totalPricePerItem = discountedPrice + gstAmount;
    const totalPrice = totalPricePerItem * quantity;

    return totalPrice.toFixed(2);
};