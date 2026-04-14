<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'

const navItems = [
  { label: '首页', to: '/' },
  { label: '登录', to: '/login' },
  { label: '注册', to: '/register' },
]

const fullDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<template>
  <div class="full-height-layout">
    <SiteHeader :nav-items="navItems" logo-suffix="TECH" />

    <main class="agreement-main">
      <article class="agreement-wrapper glass">
        <h1>TANEI 用户协议</h1>
        <p class="agreement-updated">最后更新：2025 年 3 月</p>

        <section>
          <h2>一、总则</h2>
          <p>
            欢迎使用 TANEI（塔内）计算机社团服务平台。在注册或使用本平台服务前，请您务必仔细阅读并充分理解本协议。您注册、登录、使用本平台服务即视为您已阅读、理解并同意接受本协议的全部内容。
          </p>
        </section>

        <section>
          <h2>二、服务说明</h2>
          <p>
            TANEI 是华南师范大学计算机社团的官方平台，旨在为成员提供技术交流、项目协作、活动报名及社团管理等相关服务。我们保留根据实际需要调整服务内容的权利。
          </p>
        </section>

        <section>
          <h2>三、账号注册与安全</h2>
          <p>1. 您应使用真实、准确的信息完成注册，并妥善保管账号及密码。</p>
          <p>2. 您对通过该账号进行的一切活动负责，如发现账号被盗用，请及时联系我们。</p>
          <p>3. 禁止将账号转让、出借或共享给他人使用。</p>
        </section>

        <section>
          <h2>四、用户行为规范</h2>
          <p>您在使用本平台时，应遵守法律法规及学校规章制度，不得：</p>
          <ul>
            <li>发布违法违规、虚假、侵权或不良信息；</li>
            <li>干扰、破坏平台正常运行或他人正常使用；</li>
            <li>未经授权访问他人账号或系统；</li>
            <li>进行任何可能危害网络安全的行为。</li>
          </ul>
          <p>违反上述规定的，我们有权暂停或终止您的账号及服务。</p>
        </section>

        <section>
          <h2>五、知识产权</h2>
          <p>
            本平台内容（包括但不限于文字、图片、 logo、界面设计等）的知识产权归 TANEI 社团及相关权利人所有。未经书面许可，不得擅自使用、复制或传播。
          </p>
        </section>

        <section>
          <h2>六、隐私保护</h2>
          <p>
            我们重视您的隐私。您提供的个人信息将仅用于社团服务及管理，我们不会向第三方出售或非法提供您的个人信息。具体规则以《隐私政策》为准。
          </p>
        </section>

        <section>
          <h2>七、协议变更</h2>
          <p>我们可能适时修订本协议，修订后的协议将在平台公布。若您继续使用服务，即视为接受修订后的协议。</p>
        </section>

        <section>
          <h2>八、联系我们</h2>
          <p>如对本协议有任何疑问，请通过平台提供的联系方式与我们取得联系。</p>
        </section>

        <div class="agreement-footer">
          <RouterLink to="/register" class="btn primary">返回注册</RouterLink>
          <RouterLink to="/" class="btn ghost">返回首页</RouterLink>
        </div>
      </article>
    </main>

    <SiteFooter left-title="TANEI" :left-text="fullDate" :links="[{ label: '返回首页', to: '/' }]" />
  </div>
</template>
