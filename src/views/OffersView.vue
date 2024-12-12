<template>
  <div class="offers border border-x-gray-100 p-5">
    <div class="flex justify-between items-center">
      <h1 class="md:text-3xl sm:text-2xl text-lg lg:text-4xl font-bold mb-5">
        اداره العروض
      </h1>
      <ServiceModal
        title="اضافه عرض جديد"
        @addNewOffer="handleAddOffer"
        :offerObj="{
          _id: 0,
          image: { secure_url: '' },
          categoryId: 1,
        }"
        :categoryList="categoryList"
        type="add"
        name="offer"
      />
    </div>
    <div class="offersWrapper">
      <div class="categoryList">
        <CategorySelect :categoryList="categoryList" class="w-[50%]" />
      </div>

      <div
        class="flex flex-wrap justify-between gap-5 mt-5"
        v-if="offerList.length > 0"
      >
        <OfferCard
          v-for="(offer, index) in offerList"
          :key="index"
          :image="offer.image.secure_url"
          :categoryId="offer.categoryId"
          :offerId="offer._id"
          :categoryList="categoryList"
        />
      </div>
      <div v-else class="flex justify-center items-center min-h-[400px]">
        <p>قم باضافه عروض</p>
      </div>
      <div v-if="OffersErrorMsg">{{ OfferErrorMsg }}</div>
    </div>
  </div>
</template>

<style></style>
<script setup>
import { ref, provide, onMounted } from "vue";
import { toast } from "vue3-toastify";
import OfferCard from "@/components/OfferCard.vue";
import CategorySelect from "@/components/CategorySelect.vue";
import ServiceModal from "@/components/ServiceModal.vue";
import axios from "axios";
const offerFilter = ref([]);
// const offerList = ref([
//   { _id: 1, image: { image_url: "/logo.png", public_id: 1 }, categoryId: 1 },
//   { _id: 2, image: { image_url: "/logo.png", public_id: 2 }, categoryId: 1 },

//   { _id: 3, image: { image_url: "/logo.png", public_id: 3 }, categoryId: 2 },

//   { _id: 4, image: { image_url: "/logo.png", public_id: 4 }, categoryId: 2 },
//   { _id: 5, image: { image_url: "/logo.png", public_id: 5 }, categoryId: 3 },
//   { _id: 6, image: { image_url: "/logo.png", public_id: 6 }, categoryId: 3 },
//   { _id: 7, image: { image_url: "/logo.png", public_id: 7 }, categoryId: 3 },
// ]);
const offerList = ref([]);
offerFilter.value = offerList.value;
// const categoryList = ref([
//   { id: 1, title: "cameras" },
//   { id: 2, title: "Black Friday" },
//   { id: 3, title: "telphones" },
// ]);
const categoryList = ref([]);
const createFormData = (ImgFile) => {
  const formData = new FormData();
  if (ImgFile instanceof File) {
    formData.append("image", ImgFile);
  } else {
    toast.warning("Invalid image object!");
    return;
  }
  return formData;
};
const handleAddOffer = async (offer) => {
  try {
    const formData = createFormData(offer.ImgFile);
    if (formData) {
      const response = await axios.post(
        `https://dashboard-omega-three-28.vercel.app/offer/${offer.categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data.data);
        const data = response.data.data;
        toast.success("تمت الاضافة بنجاح");
        offerList.value.push({
          _id: data.id,
          image: { secure_url: data.secure_url },
          categoryId: offer.categoryId,
        });
        console.log(offerList.value);
      } else {
        toast.warning("يرجي المحاوله مره اخري");
      }
    }
  } catch (error) {
    toast.error("حدث خطأ يرجي المحاوله مره اخري");
  }
};
const handleDeleteAll = () => {
  offerList.value = [];
};
const handleEditOffer = async (offer) => {
  try {
    const formData = createFormData(offer.ImgFile);
    const response = await axios.patch(
      `https://dashboard-omega-three-28.vercel.app/offer/${offer._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      const data = response.data.data
      console.log(response.data.data);
      const target = offerList.value.find((ele) => ele._id === offer._id);
      if (target) {
        Object.assign(target, {
          _id: data.id,
          image: { secure_url: data.secure_url },
          categoryId: offer.categoryId,
        });
      }
      toast.success("تم التعديل بنجاح��");
    } else {
      toast.warning("يرجي المحاوله مره اخري");
    }
  } catch (error) {
    toast.error("حدث خطأ يرجي المحاوله مره اخري");
    console.log(error.message);
  }
};
const handleDeleteOffer = async (offerId) => {
  try {
    const response = await axios.delete(
      `https://dashboard-omega-three-28.vercel.app/offer/${offerId}`
    );
    if (response.status === 200) {
      toast.success("تم الحذف بنجاح");
      const index = offerList.value.findIndex((ele) => ele._id === offerId);
      if (index > -1) {
        offerList.value.splice(index, 1);
      }
    }
  } catch (error) {
    toast.error("حدث خطأ يرجي المحاوله مره اخري");
  }
};
const handleEditCategory = (catId, name) => {
  const target = categoryList.value.find((ele) => ele.id === catId);
  if (target) {
    target.name = name;
  }
};
const handleDeleteCategory = (catId) => {
  const index = categoryList.value.findIndex((ele) => ele.id === catId);
  if (index > -1) {
    categoryList.value.splice(index, 1);
  }
};
provide("offerApi", {
  editOffer: handleEditOffer,
  deleteOffer: handleDeleteOffer,
  deleteCategory: handleDeleteCategory,
  editCategory: handleEditCategory,
  addOffer: handleAddOffer,
});
// get All Categories
const getAllCategories = async () => {
  try {
    const response = await axios.get(
      "https://dashboard-omega-three-28.vercel.app/Category/all"
    );
    if (response.status === 200) {
      console.log(response);
      categoryList.value = response?.data?.data || [];
      console.log(categoryList.value);
    } else {
      console.log(response.error);
    }
  } catch (err) {
    console.error(err.message);
  }
};
const OffersErrorMsg = ref("");
const getCategoryOffers = () => {
  OffersErrorMsg.value = "";
  if (categoryList.value.length > 0) {
    // get first category offers
    getCategoryOffersById(categoryList.value[0]._id);
  } else {
    OffersErrorMsg.value = "قم باضافه عروض";
  }
};
const getCategoryOffersById = async (CatId) => {
  try {
    const response = await axios.get(
      `https://dashboard-omega-three-28.vercel.app/offer/categoryId=${CatId}`
    );
    if (response.status === 200) {
      console.log(response);
      offerList.value = response.data.data;
    } else {
      console.log(response.error);
      OffersErrorMsg.value = "لا يوجد عروض بهذا القسم";
    }
  } catch (err) {
    console.error(err.message);
    OffersErrorMsg.value = "حدث خطأ في البحث";
  }
};
onMounted(async () => {
  await getAllCategories();
  getCategoryOffers();
});
</script>
