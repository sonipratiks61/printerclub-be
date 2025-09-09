export const calculatePrice = ({
  price,
  quantity,
  gst,
  discount = 0,
}: {
  price: number;
  quantity: number;
  gst: number;
  discount?: number | null;
}) => {
  const discountedPrice = price * (1 - (discount || 0) / 100);
  const gstAmount = discountedPrice * (gst / 100);
  const totalPricePerItem = discountedPrice + gstAmount;
  const totalPrice = totalPricePerItem * quantity;

  return totalPrice.toFixed(2);
};

function extractSizes(data: string) {
  // Regular expression to match "width * height - quantity" pattern
  const regex = /^(\d+)\s*\*\s*(\d+)\s*-\s*(\d+)$/;

  // Split the input string by commas, trim each expression, and process
  const sizes = data.split(',').map((expression: string) => expression.trim());

  let totalSize = 0;
  let totalQuantity = 0;

  for (const expression of sizes) {
    const match = expression.match(regex);
    if (match) {
      const width = parseInt(match[1], 10);
      const height = parseInt(match[2], 10);
      const quantity = parseInt(match[3], 10);

      // Calculate the size as height * width and accumulate it
      totalSize += width * height;

      // Sum the quantities
      totalQuantity += quantity;
    }
  }

  // Return the final object with the computed values
  return { size: totalSize, quantity: totalQuantity };
}

export const calculateAttributesPrice = (attributes) => {
  const price = attributes
    ?.filter(
      (attribute) => attribute.value || attribute.height || attribute.width,
    )
    .reduce((total: number, attribute) => {
      if (attribute.name.toLowerCase() === 'square feet') {
        if (attribute.value) {
          const regex = /^(\d+)\s*\*\s*(\d+)$/;
          const match = attribute.value.match(regex);
          if (match) {
            const width = parseInt(match[1], 10);
            const height = parseInt(match[2], 10);

            return total + width * height * (Number(attribute.price) || 1);
          }
        }

        return (
          total +
          Number(attribute.width || 0) *
            Number(attribute.height || 0) *
            (Number(attribute.price) || 1)
        );
      }

      return total + Number(attribute.price || 0);
    }, 0);

  return price;
};
