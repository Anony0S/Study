<template>
    <div class="img-reduce">
        <!-- 图片上传 - 带压缩功能 -->
        <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: "ReduceCompt",
    data() {
        return {
            action: "https://jsonplaceholder.typicode.com/posts/",
            imageUrl: null,
        };
    },
    methods: {
        // 上传文件之前进行的操作
        // 返回 false 或 promise reject 则停止上传

        beforeAvatarUpload(file) {
            const fileSize = file.size / 1024 / 1024;
            console.log("图片原始大小：", fileSize.toFixed(2) + "M");
            // 创建画布
            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            // 创建新的图片对象
            let img = new Image();
            // 指定图片的DataURL(base64格式/此处使用Blob)
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                // 指定画布大小 =》 这里设置为原大小
                canvas.width = img.width;
                canvas.height = img.height;
                // 绘制画布
                context.drawImage(img, 0, 0);
                // 核心：将绘制完成的图片转化为base64，并进行压缩
                this.imageUrl = canvas.toDataURL(file.type, 0.5);
            };
            return false;
        },

        // 上传成功回调
        handleAvatarSuccess() {
            console.log("文件上传成功！");
        },

        // 压缩部分核心代码 => 暂时未用
        canvasDataURL(file, item, callback) {
            let reader = new FileReader(); // 读取文件的对象
            reader.readAsDataURL(file); // 对文件读取 ，读取完成后会以base64的形式赋值给result属性
            reader.onload = function () {
                const img = new Image();
                const quality = 0.2; // 图像质量
                const canvas = document.createElement("canvas"); // 创建canvas画布
                const drawer = canvas.getContext("2d"); // 创建绘制2d图的环境对象
                img.src = this.result; // 将读取文件完成后返回的地址赋值给创建的图片src（base64赋值给src可以直接显示）
                // 图片压缩代码，注意：img图片渲染是异步的，所以必须在img的onload钩子中进行操作
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
                    this.convertBase64UrlToBlob(
                        canvas.toDataURL(file.type, quality),
                        callback
                    );
                };
            };
        },

        // 将base64转换为Blob格式 => 暂时未用
        convertBase64UrlToBlob(urlData, callback) {
            // console.log("压缩成base64的对象：",urlData);
            const arr = urlData.split(",");
            // console.log("arr",arr);
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = window.atob(arr[1]); //atob方法用于解码base64
            // console.log("将base64进行解码:",bstr);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            // console.log("Uint8Array:",u8arr);
            callback(
                new Blob([u8arr], {
                    type: mime,
                })
            );
        },
    },
};
</script>

<style>
</style>