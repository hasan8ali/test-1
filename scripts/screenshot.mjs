/**
 * Screenshot script — starts dev server, seeds sample data,
 * navigates the app, takes screenshots of every major view,
 * and saves them to /home/z/my-project/download/showcase/.
 *
 * Usage: node scripts/screenshot.mjs
 */
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = '/home/z/my-project/repos/test-1'
const OUT = '/home/z/my-project/download/showcase'
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 500) return true
    } catch (e) {
      // not yet
    }
    await sleep(1000)
  }
  throw new Error('Server did not come up in time')
}

async function main() {
  // 1) Start dev server
  console.log('▶ Starting dev server...')
  const dev = spawn('npm', ['run', 'dev'], {
    cwd: ROOT,
    stdio: 'pipe',
    env: { ...process.env, TOLNERA_DB_PATH: './data/showcase.db' }
  })
  dev.stdout.on('data', (d) => process.stdout.write(`[dev] ${d}`))
  dev.stderr.on('data', (d) => process.stderr.write(`[dev] ${d}`))

  try {
    await waitForServer('http://localhost:3000/api/themes')
    console.log('✓ Server is up')

    // 2) Seed: create a sample page with blocks (via API)
    console.log('▶ Seeding sample page...')
    const blocks = [
      {
        id: crypto.randomUUID(),
        type: 'hero',
        props: {
          eyebrow: 'منصة Tolnera التعليمية',
          title: 'تعلَّم من أفضل المدرّسين، في أي وقت ومن أي مكان',
          subtitle: 'انضم لآلاف الطلاب اللي غيّروا مستقبلهم مع كورساتنا الاحترافية. محتوى عملي، مدرّسون خبراء، وشهادات معتمدة.',
          primaryButton: { text: 'ابدأ الآن مجاناً', href: '#' },
          secondaryButton: { text: 'تصفّح الكورسات', href: '#' },
          image: '',
          layout: 'centered',
          background: 'gradient',
          align: 'center'
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      },
      {
        id: crypto.randomUUID(),
        type: 'stats',
        props: {
          items: [
            { value: '10K+', label: 'طالب نشط' },
            { value: '500+', label: 'كورس متاح' },
            { value: '50+', label: 'مدرّس خبير' },
            { value: '4.9', label: 'متوسط التقييم' }
          ]
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      },
      {
        id: crypto.randomUUID(),
        type: 'feature-grid',
        props: {
          title: 'لماذا تختار Tolnera؟',
          subtitle: 'ميزات بتفرّق — صُممت عشان تجعل رحلتك التعليمية أسهل وأعمق',
          columns: 3,
          features: [
            { icon: 'i-lucide-graduation-cap', title: 'مدرّسون خبراء', description: 'تعلَّم من أفضل المدرّسين في مجالاتهم بخبرة سنين طويلة' },
            { icon: 'i-lucide-clock', title: 'وصول مدى الحياة', description: 'ادرس على راحتك، في أي وقت — الكورسات بتاعتك للأبد' },
            { icon: 'i-lucide-badge-check', title: 'شهادة معتمدة', description: 'احصل على شهادة معتمدة عند إتمام كل كورس بنجاح' }
          ]
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      },
      {
        id: crypto.randomUUID(),
        type: 'course-grid',
        props: {
          title: 'الكورسات الأكثر شعبية',
          columns: 3,
          limit: 3,
          showFilter: false,
          apiUrl: '/api/tolnera/courses'
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      },
      {
        id: crypto.randomUUID(),
        type: 'pricing-card',
        props: {
          name: 'الباقة الاحترافية',
          price: '299',
          currency: 'ج.م',
          period: '/شهرياً',
          description: 'مثالية للمتعلمين الجادين',
          features: ['وصول لجميع الكورسات', 'شهادات معتمدة', 'دعم فني 24/7', 'تحديثات مجانية', 'مجموعة طلابية خاصة'],
          ctaText: 'اشترك الآن',
          ctaHref: '#',
          featured: true
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      },
      {
        id: crypto.randomUUID(),
        type: 'testimonial',
        props: {
          quote: 'منصة Tolnera غيّرت مسيرتي المهنية تماماً. تعلمت React من الصفر لحد ما اشتغلت مبرمج محترف. المحتوى عملي والمدرّسون على أعلى مستوى.',
          authorName: 'أحمد محمد',
          authorTitle: 'مطور برمجيات @ شركة تقنية',
          authorImage: '',
          rating: 5
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      },
      {
        id: crypto.randomUUID(),
        type: 'faq',
        props: {
          title: 'الأسئلة الشائعة',
          items: [
            { question: 'كيف أشترك في كورس؟', answer: 'اختر الكورس، اضغط اشترك، أكمل الدفع، وابدأ التعلم فوراً.' },
            { question: 'هل أحصل على شهادة؟', answer: 'نعم، بعد إتمام الكورس تحصل على شهادة معتمدة يمكنك إضافتها على LinkedIn.' },
            { question: 'هل يوجد استرجاع للمبلغ؟', answer: 'خلال 14 يوم من الشراء إذا لم تبدأ الكورس.' }
          ]
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      },
      {
        id: crypto.randomUUID(),
        type: 'cta',
        props: {
          title: 'جاهز لبدء رحلتك التعليمية؟',
          subtitle: 'انضم لآلاف الطلاب today وغيّر مستقبلك',
          buttonText: 'سجّل مجاناً الآن',
          buttonHref: '#',
          background: 'gradient'
        },
        visibility: { mobile: true, tablet: true, desktop: true }
      }
    ]

    const page = await fetch('http://localhost:3000/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'صفحة الهبوط — Tolnera',
        themeId: 'theme-aurora',
        blocks,
        status: 'published'
      })
    }).then((r) => r.json())

    console.log('✓ Sample page created:', page.id, 'slug:', page.slug)
    const builderUrl = `http://localhost:3000/builder/${page.id}`
    const publicUrl = `http://localhost:3000/p/${page.slug}`
    const dashboardUrl = 'http://localhost:3000/'

    // 3) Launch browser
    console.log('▶ Launching browser...')
    const browser = await chromium.launch()
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      locale: 'ar-EG'
    })

    // ===== Screenshot 1: Dashboard =====
    console.log('▶ [1/6] Screenshotting Dashboard...')
    const p1 = await ctx.newPage()
    await p1.goto(dashboardUrl, { waitUntil: 'networkidle' })
    await sleep(2000)
    await p1.screenshot({ path: resolve(OUT, '01-dashboard.png'), fullPage: false })
    console.log('  saved 01-dashboard.png')

    // ===== Screenshot 2: Builder (desktop preview) =====
    console.log('▶ [2/6] Screenshotting Builder (desktop)...')
    const p2 = await ctx.newPage()
    await p2.goto(builderUrl, { waitUntil: 'networkidle' })
    await sleep(3500)
    // Click on the canvas to dismiss any popups
    await p2.mouse.click(720, 450)
    await sleep(500)
    await p2.screenshot({ path: resolve(OUT, '02-builder-desktop.png'), fullPage: false })
    console.log('  saved 02-builder-desktop.png')

    // ===== Screenshot 3: Builder with Hero block selected =====
    console.log('▶ [3/6] Screenshotting Builder with Hero selected...')
    try {
      // Click the Inspector side to make sure right panel is visible
      // Then click the first block in canvas
      const heroBlock = p2.locator('.t-block').first()
      if (await heroBlock.count() > 0) {
        await heroBlock.click({ position: { x: 50, y: 50 }, timeout: 5000 })
        await sleep(1500)
      }
    } catch (e) {
      console.log('  (Hero click failed, continuing)')
    }
    await p2.screenshot({ path: resolve(OUT, '03-builder-hero-selected.png'), fullPage: false })
    console.log('  saved 03-builder-hero-selected.png')

    // ===== Screenshot 4: Theme picker =====
    console.log('▶ [4/6] Screenshotting Theme picker...')
    try {
      const themeBtn = p2.getByRole('button', { name: /الثيم/ }).first()
      if (await themeBtn.isVisible({ timeout: 3000 })) {
        await themeBtn.click()
        await sleep(2000)
        await p2.screenshot({ path: resolve(OUT, '04-theme-picker.png'), fullPage: false })
        console.log('  saved 04-theme-picker.png')
        await p2.keyboard.press('Escape')
        await sleep(500)
      }
    } catch (e) {
      console.log('  (theme picker failed, continuing)', e.message)
    }

    // ===== Screenshot 5: Mobile preview =====
    console.log('▶ [5/6] Screenshotting Mobile preview...')
    try {
      // Find the device switcher buttons (3 in a group)
      // The first one is mobile, second tablet, third desktop
      const switcherGroup = p2.locator('.flex.items-center.gap-1.bg-\\[var\\(--ui-bg-elevated\\)\\]').first()
      if (await switcherGroup.isVisible({ timeout: 3000 })) {
        const btns = switcherGroup.locator('button')
        if (await btns.count() >= 1) {
          await btns.first().click()
          await sleep(2000)
        }
      }
    } catch (e) {
      console.log('  (mobile switch failed, continuing)', e.message)
    }
    await p2.screenshot({ path: resolve(OUT, '05-builder-mobile.png'), fullPage: false })
    console.log('  saved 05-builder-mobile.png')

    // ===== Screenshot 6: Public page (preview) =====
    console.log('▶ [6/6] Screenshotting Public page (preview)...')
    const p3 = await ctx.newPage()
    await p3.goto(publicUrl, { waitUntil: 'networkidle' })
    await sleep(4000)
    await p3.screenshot({ path: resolve(OUT, '06-public-page-top.png'), fullPage: false })
    console.log('  saved 06-public-page-top.png')

    // Full page screenshot of public page
    await p3.screenshot({ path: resolve(OUT, '07-public-page-full.png'), fullPage: true })
    console.log('  saved 07-public-page-full.png')

    // Scroll to middle (features section)
    await p3.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4))
    await sleep(800)
    await p3.screenshot({ path: resolve(OUT, '09-public-features.png'), fullPage: false })
    console.log('  saved 09-public-features.png')

    // Scroll to bottom (FAQ + CTA)
    await p3.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75))
    await sleep(800)
    await p3.screenshot({ path: resolve(OUT, '10-public-faq-cta.png'), fullPage: false })
    console.log('  saved 10-public-faq-cta.png')

    // ===== Bonus: a Midnight theme public page =====
    console.log('▶ [Bonus] Trying Midnight theme...')
    await fetch(`http://localhost:3000/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId: 'theme-midnight' })
    })
    await p3.reload({ waitUntil: 'networkidle' })
    await sleep(3000)
    await p3.screenshot({ path: resolve(OUT, '08-midnight-theme.png'), fullPage: false })
    console.log('  saved 08-midnight-theme.png')

    // Sunset theme on public page
    console.log('▶ [Bonus] Trying Sunset theme...')
    await fetch(`http://localhost:3000/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId: 'theme-sunset' })
    })
    await p3.reload({ waitUntil: 'networkidle' })
    await sleep(3000)
    await p3.screenshot({ path: resolve(OUT, '11-sunset-theme.png'), fullPage: false })
    console.log('  saved 11-sunset-theme.png')

    // Forest theme
    console.log('▶ [Bonus] Trying Forest theme...')
    await fetch(`http://localhost:3000/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId: 'theme-forest' })
    })
    await p3.reload({ waitUntil: 'networkidle' })
    await sleep(3000)
    await p3.screenshot({ path: resolve(OUT, '12-forest-theme.png'), fullPage: false })
    console.log('  saved 12-forest-theme.png')

    // Restore Aurora
    await fetch(`http://localhost:3000/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId: 'theme-aurora' })
    })

    await browser.close()
    console.log('✓ All screenshots done')
  } finally {
    // Kill dev server
    console.log('▶ Stopping dev server...')
    dev.kill('SIGTERM')
    await sleep(2000)
    if (!dev.killed) dev.kill('SIGKILL')
    process.exit(0)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
