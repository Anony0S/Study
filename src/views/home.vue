<template>
    <div class="home">
        <h3>上传组件：限制大小和宽高</h3>
        <Upload></Upload>
        <hr />
        <h3>上传组件：图片压缩</h3>
        <ImgReduce></ImgReduce>
        <hr />
    </div>
</template>

<script>
import Upload from "../components/upload.vue";
import ImgReduce from "../components/imgReduce.vue";
export default {
    data() {
        return {};
    },
    components: { Upload, ImgReduce },
};
</script>

<style>
</style>