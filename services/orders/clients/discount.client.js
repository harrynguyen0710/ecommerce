const axios = require("axios");

const DISCOUNT_BASE_URL = process.env.DISCOUNT_BASE_URL;

async function applyDiscountCode({ token, code, totalAmount }) {
  const res = await axios.post(
    `${DISCOUNT_BASE_URL}/discounts/apply`,
    {
      code,
      totalAmount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

async function previewDiscount(token, payload) {
  const url = `${DISCOUNT_BASE_URL}/discounts/preview`;
  const res = await axios.post(url,
    {
      payload,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );

  return res.result;
}

module.exports = {
  applyDiscountCode,
  previewDiscount,
};
