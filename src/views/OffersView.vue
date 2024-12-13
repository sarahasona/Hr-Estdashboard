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
    <div class="offersWrapper" v-if="!isLoading">
      <div class="categoryList">
        <CategorySelect
          :categoryList="categoryList"
          class="w-[50%]"
          :currentCategory="currentCategory"
          name="offer"
          v-model="currentCategory"
          @updateOfferList="handleUpdateOffersList"
        />
      </div>

      <div
        class="flex flex-wrap justify-center md:justify-start items-center gap-5 mt-5"
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
      <div v-if="OffersErrorMsg">{{ OffersErrorMsg }}</div>
    </div>
    <div v-else class="flex justify-center items-center min-h-[400px] border">
      <fwb-spinner size="10" color="blue" />
    </div>
  </div>
</template>

<style></style>
<script setup>
import { ref, provide, onMounted ,watch} from "vue";
import { toast } from "vue3-toastify";
import { FwbSpinner } from "flowbite-vue";
import OfferCard from "@/components/OfferCard.vue";
import CategorySelect from "@/components/CategorySelect.vue";
import ServiceModal from "@/components/ServiceModal.vue";
import axios from "axios";
const isLoading = ref(false);
const offerFilter = ref([]);
const offerList = ref([]);
offerFilter.value = offerList.value;
const categoryList = ref([]);
const OffersErrorMsg = ref("");
const currentCategory = ref("");
const createFormData = (ImgFile) => {
  const formData = new FormData();
  if (ImgFile instanceof File) {
    formData.append("image", ImgFile);
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
        const data = response.data.data;
        toast.success("تمت الاضافة بنجاح");
        if(currentCategory.value === offer.categoryId){
          offerList.value.push({
          _id: data.id,
          image: { secure_url: data.secure_url },
          categoryId: offer.categoryId,
        });
        }
        
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
      const data = response.data.data;
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
//watch any change in select list 
watch(currentCategory, async (newCategoryId) => {
  if (newCategoryId) {
    await getCategoryOffersById(newCategoryId);
  }
});

// get All Categories
const getAllCategories = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(
      "https://dashboard-omega-three-28.vercel.app/Category/all"
    );
    if (response.status === 200) {
      categoryList.value = response?.data?.data || [];
      if (categoryList.value.length > 0) {
        currentCategory.value = categoryList.value[0]._id; 
      } else {
        OffersErrorMsg.value = "لا يوجد فئات";
      }
    } else {
    }
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    OffersErrorMsg.value = "خطأ في تحميل الفئات";
  }
};


const getCategoryOffers = () => {
  OffersErrorMsg.value = "";
  if (categoryList.value.length > 0) {
    // get first category offers
    getCategoryOffersById(categoryList.value[0]._id);
    currentCategory.value = categoryList.value[0]._id;
  } else {
    OffersErrorMsg.value = "قم باضافه عروض";
  }
};
const getCategoryOffersById = async (CatId) => {
  try {
    isLoading.value = true;
    const response = await axios.get(
      `https://dashboard-omega-three-28.vercel.app/offer/${CatId}`
    );
    if (response.status === 200) {
      offerList.value = response.data.data;
    } else {
      OffersErrorMsg.value = "لا يوجد عروض بهذا القسم";
    }
    isLoading.value = false;

  } catch (err) {
    isLoading.value = false;
    OffersErrorMsg.value = "حدث خطأ في البحث";
  }
};
const handleUpdateOffersList = (newCategory)=>{
  currentCategory.value = newCategory;
  getCategoryOffersById(newCategory);
}
onMounted(async () => {
  await getAllCategories();
  getCategoryOffers();
});
</script>
