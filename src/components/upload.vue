<template>
    <div class="uploadCompt">
        <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="action"
            :limit="1"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :headers="headers"
        >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: "Upload",
    data() {
        return {
            // ===== 图片上传相关 =====
            action: "https://jsonplaceholder.typicode.com/posts/", // 上传地址
            imageUrl: "",
            width: 60, // 限制宽度
            height: 60, // 限制高度
            imgSize: 3, // 单位：M
            headers: {}, // 上传请求头携带信息
        };
    },
    methods: {
        handleAvatarSuccess(res) {
            // 解决上传文件只能上传一次 ，第二次后无反应的问题的坑（浏览器还保存着我们已经上传的文件）
            this.$refs.upload.clearFiles();
            this.imageUrl = res.data; // 成功时的图片回显
        },

        beforeAvatarUpload(file) {
            // === 限制格式和大小
            const isTypeTrue = /^image\/(jpeg|png|jpg)$/.test(file.type);
            const isLt = file.size / 1024 / 1024 < this.imgSize;
            if (!isTypeTrue) {
                this.$message.error("请上传指定格式图片");
                return false;
            }
            if (!isLt) {
                this.$message.error(`请上传大小在${this.imgSize}M内的图片`);
                return false;
            }
            // === 限制尺寸
            let _this = this;
            const isSize = new Promise(function (resolve, reject) {
                let width = _this.width; // 限制图片尺寸
                let height = _this.height;
                // URL对象是硬盘（SD卡等）指向文件的一个路径
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                //设置src才能取到图片宽高等属性
                img.src = _URL.createObjectURL(file);
                img.onload = function () {
                    console.log("Width:", img.width, "height:", img.height);
                    let valid = img.width <= width && img.height <= height;
                    // let valid = true;
                    valid ? resolve(img.src) : reject();
                };
            }).then(
                (res) => {
                    _this.imageUrl = res; // 图片回显
                    return file;
                },
                () => {
                    _this.$message.error(`上传图片与要求尺寸不符,请重新上传`);
                    return Promise.reject();
                }
            );
            return isTypeTrue && isLt && isSize;
        },
    },
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>