<template>
  <el-container>
    <el-main>
      <div class="main-page">
        <!--主要路由区域-->
        <div class="main-content">
          <!-- v-me-editor 组件-->
          <div id="main">
            <div class="nav">
              <div class="main-content-nav">
                <div id="sell" class="main-content-nav-item" :class="{selected:selectDiv==='sell'}" @click="loadSell()">出</div>
                <div id="buy" class="main-content-nav-item" :class="{selected:selectDiv==='buy'}" @click="loadBuy()">收</div>
              </div>
              <div class="nav-item">
                <div class="table-title">出/收物品</div>
              </div>
              <div class="nav-item">
                <div class="table-title">联系人</div>
              </div>
            </div>
            <div class="content">
              <div v-if="showSell">
                <SellComponent v-for="sellContent in contentList" :key="sellContent.id"
                               :sellContent="sellContent"></SellComponent>
              </div>
              <div v-if="!showSell">
                <BuyComponent v-for="buyContent in buycontentList" :key="buyContent.id" :buyContent="buyContent"></BuyComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="vice-content">
        <div class="vice-content-title">
          <i class="icon-bubble"></i>
          快速发布出售&收购信息
        </div>
        <div class="vice-content-nav">
          <div class="info-form">
            <el-form :model="stuffInfo" >
              <el-form-item label="物品名称">
                <el-input v-model="stuffInfo.name" placeholder="出/收物品的名称"/>
              </el-form-item>
              <el-form-item label="预估价格">
                <el-input v-model="stuffInfo.price" />
              </el-form-item>
              <el-form-item label="联系人">
                <el-input v-model="stuffInfo.publisher" placeholder="联系人姓名"/>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input v-model="stuffInfo.contact" placeholder="联系方式（微信号/QQ号）"/>
              </el-form-item>
              <el-form-item label="出售/收购">
                <el-radio-group v-model="stuffInfo.is_buyer">
                  <el-radio :label="false">出</el-radio>
                  <el-radio :label="true">收</el-radio>>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="stuffInfo.is_buyer === false">
                <el-upload
                    v-model:file-list="imageFile"
                    class="upload-demo"
                    :action="uploadActionUrl"
                    :on-success="handleSuccess"
                    id="bnt"
                >
                  <el-button type="primary">Click to upload</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      jpg/png files with a size less than 500kb
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <div class="vice-content-nav-item">
            <el-button type="primary" circle @click="submit"><i class="icon-store"></i></el-button>
            <h5>出</h5>
          </div>
          <div class="vice-content-nav-item">
            <el-button type="warning" circle @click="submit"><i class="icon-cart"></i></el-button>
            <h5>收</h5>
          </div>
        </div>
        <div class="quick-QA">
          <div style="margin: 10px 0">
            <el-button type="primary" @click="submit">发布</el-button>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>



</template>

<script>
import {ref, reactive, toRefs, onMounted} from "vue"
import SellComponent from "@/components/sellComponent.vue";
import BuyComponent from "@/components/buyComponent.vue";
import router from "@/router";
import axios from "axios";
import Swal from "sweetalert2";
// import {sellContentList} from "@/hook/SellContentList";

export default {
  components: {
    SellComponent,
    BuyComponent,
  },
  methods: {toRefs},
  setup() {
    let selectDiv = ref('sell')
    let imageUrl = ref()
    let imageFile = reactive([])
    const uploadActionUrl = ref('http://10.26.5.9:8081/cloud_storage/file/uploading')
    let stuffInfo = reactive({
      name:'',
      picture:'',
      publisher:'',
      is_buyer:false,
      contact:'',
      price:0,
    })
    const contentList = reactive([])
    const buycontentList = reactive([])
    let showSell = ref(true)

    function loadSell() {
      console.log("click sell")
      selectDiv.value = 'sell'
      showSell.value = true
    }

    function loadBuy() {
      console.log("click buy")
      selectDiv.value = 'buy'
      showSell.value = false
    }

    function loadOrder(){
      axios({
        method: 'GET',
        url: 'http://10.26.5.9:8010/order/getAll',
        transformRequest: [function (data) {
          let str = '';
          for (let key in data) {
            str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
          }
          return str;
        }]
      }).then(resp => {
        if (resp.status === 200){
          console.log(resp.data.data)
          let list = resp.data.data.order
          console.log(list)
          for (let i = 0;i < list.length;i++){
            if (list[i].status ===0){
              buycontentList.push({
                id:list[i].id,
                stuff:list[i].name,
                poster:list[i].buyer,
                contact:list[i].buyer_contact,
                price:list[i].price,
              })
            } else {
              contentList.push({
                id:list[i].id,
                stuff: list[i].name,
                images: list[i].picture,
                poster: list[i].seller,
                contact:list[i].seller_contact,
                avatar_url: 'https://avatars.githubusercontent.com/u/77684181?s=96&v=4',
                price: list[i].price,
              })
            }
          }
          console.log(buycontentList)
          console.log(contentList)
        }
      })
    }
    function handleSuccess(resp){
      imageUrl.value = resp.data.url
      console.log(imageUrl)
      stuffInfo.picture = imageUrl.value
    }

    function submit(){
      console.log(stuffInfo)
      axios({
        method: 'POST',
        url: 'http://10.26.5.9:8010/order/add',
        params: {
          //TODO:随机给一个id，id要是string类型
          name: stuffInfo.name,
          picture: stuffInfo.picture,
          publisher:stuffInfo.publisher,
          is_buyer:stuffInfo.is_buyer,
          contact:stuffInfo.contact,
          price:stuffInfo.price,
        },
        transformRequest: [function (data) {
          let str = '';
          for (let key in data) {
            str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
          }
          return str;
        }]
      }).then(resp => {
        if (resp.status === 200){
          Swal.fire({
            icon: 'success',
            title: '二手交易帖子',
            text: '您的帖子已發佈！',
          })
          if (stuffInfo.is_buyer){
            selectDiv.value = 'buy'
            while (buycontentList.length){
              buycontentList.pop()
            }
          } else {
            while(contentList.length){
              contentList.pop()
            }
            selectDiv.value = 'sell'
          }
          loadOrder()

        }
      })
    }
    function toHomePage(){
      router.push('/');
    }
    function toSelfPage(){
      //   TODO:检查是否登录，如未登录，需要跳转登录界面
      router.push('/selfpage');
    }
    onMounted(() => {
      console.log('获取出收物品...')
      loadOrder()
      loadSell()
    })
    return {
      selectDiv,
      contentList,
      buycontentList,
      imageUrl,
      imageFile,
      uploadActionUrl,
      stuffInfo,
      showSell,
      loadBuy,
      loadSell,
      handleSuccess,
      submit,
      toHomePage,
      toSelfPage,
    }
  }
}
</script>

<style scoped>
#root {
  display: block;
}

.el-header {
  height: 80px;
  width: 100%;
  position: fixed;
  line-height: 80px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 3px hsla(0, 0%, 7%, .1);
  overflow: hidden;
  z-index: 99;
}

.el-header #logo {
  height: 50px;
  line-height: 80px;
  float: left;
}

.nav-menu {
  height: 80px;
  min-width: 100px;
  text-align: center;
  float: left;
  margin: 0 10px 0 10px;
  //background-color: rgba(238, 159, 6, 0.4);
}

.nav-menu:hover {
  border-bottom: 5px solid #e76e0d;
  cursor: pointer;
}

.search {
  float: left;
  width: 500px;
  margin-left: 30px;
}

.nav_right {
  height: 100%;
  float: right;
  margin-right: 30px;
}

.el-main {
  display: block;
  width: 100%;
  height: 100vh;
  background-color: rgb(246, 246, 246);
}

.el-main::-webkit-scrollbar {
  display: none;
}

.main-page {
  width: 90%;
  margin: 0 auto;
}

.main-content, .vice-content {
  display: inline-block;
  float: left;
}

.main-content {
  width: 65%;
  background-color: rgb(255, 255, 255);

}

.vice-content {
  width: 25%;
  margin-left: 20px;
  background-color: rgb(255, 255, 255);
}

.vice-content-title {
  height: 50px;
  line-height: 50px;
  font-size: 20px;

}

.vice-content-nav {
  width: 100%;
  text-align: center;
}

.vice-content-nav-item {
  float: left;
  width: 50%;
}

.quick-QA {
  width: 90%;
  margin: 0 auto;
  text-align: center;
}

.editor {
  display: flex;
  justify-content: center;
}

.info-form{
  margin:0 auto;
  width: 80%;
}

.main-content {
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: stretch;
}

.editor {
  flex: 1;
}

.space {
  height: 40px;
  width: 10%;
}

.chatting {
  width: 25%;
  margin-left: 20px;
  background-color: rgb(255, 255, 255);
}

.main-content, .chatting {
  display: inline-block;
  float: left;
}


.selected {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.main-content-nav-item {
  height: 100%;
  float: left;
  width: 50%;
  font-size: 16px;
  font-weight: bolder;
  line-height: 65px;
  text-align: center;
}

.main-content-nav-item:hover {
  color: #8D99DE;
  cursor: pointer;
  font-size: 20px;
}

#main {
  width: 100%;
  height: 100vh;
  background-color: rgb(255, 255, 255);
  padding: 0;
}

.nav {

}

.nav-item {
  display: inline-block;
  width: 50%;
  border-bottom: 1px solid #f0f2f7;
  overflow: hidden;
}

.table-title {
  color: rgb(133, 144, 166);
  font-family: 黑体;
  font-size: 120%;
  /*margin-left: 30px;*/
  line-height: 30px;
  border-bottom: 1px solid #f0f2f7;
  margin-left: 30px;
}

.avatar-hover img {
  width: 80%;
  height: 80%;
}

.avatar-hover {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, .5);
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 50%;
}


.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

input[type="file"]{
  display: none!important;
}
</style>