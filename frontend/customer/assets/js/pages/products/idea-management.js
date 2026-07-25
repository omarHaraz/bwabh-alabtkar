import { loadNavbar } from "../../components/navbar.js";
import { loadFooter } from "../../components/footer.js";

await loadNavbar();
await loadFooter();

// Highlight the Products navigation item
document
    .getElementById("nav-products")
    ?.classList.add("active");



const tabs = {

    collection: {

        title: "جمع الأفكار",

        description:
            "استقبل الأفكار من الموظفين والشركاء والعملاء في مكان واحد، مع إمكانية المشاركة والتصويت والتفاعل لبناء أفضل الحلول.",

        features: [
            "إرسال الأفكار",
            "إرفاق الملفات والوسائط",
            "التكامل مع المنصات الاجتماعية"
        ]

    },

    selection: {

        title: "اختيار الأفكار",

        description:
            "قيّم الأفكار باستخدام مسارات عمل مرنة وآليات تقييم تساعد على اختيار أكثر المبادرات قيمة.",

        features: [
            "مسارات عمل مرنة",
            "إدارة محافظ الأفكار",
            "ربط الأفكار ببعضها"
        ]

    },

    planning: {

        title: "تخطيط المشاريع",

        description:
            "حوّل الأفكار الواعدة إلى مشاريع عملية من خلال التخطيط والتقدير وتحديد المسؤوليات.",

        features: [
            "تحديد مالك الفكرة",
            "تقدير التكلفة والعائد",
            "منشئ مقترحات المشاريع"
        ]

    },

    development: {

        title: "تطوير الحلول",

        description:
            "أنشئ النماذج الأولية واختبرها، ثم طوّر الحلول حتى تصبح جاهزة للتنفيذ داخل المؤسسة.",

        features: [
            "بناء فرق العمل",
            "مراحل اعتماد قابلة للتخصيص",
            "تكامل مع Jira و Trello"
        ]

    },

    scaling: {

        title: "نشر الابتكار",

        description:
            "وسّع ثقافة الابتكار داخل المؤسسة، وأطلق حملات ابتكار على نطاق واسع مع إدارة كاملة للمشاركين.",

        features: [
            "مؤشرات أداء",
            "صلاحيات مخصصة",
            "واجهة API"
        ]

    },

    analytics: {

        title: "التحليلات والعائد",

        description:
            "حلّل أداء الابتكار داخل المؤسسة واكتشف الاتجاهات والفرق الأكثر تأثيراً لقياس العائد الحقيقي.",

        features: [
            "تقارير وتحليلات",
            "تكامل مع Power BI و Tableau",
            "تحليل اتجاهات النشاط"
        ]

    }

};

const title = document.getElementById("feature-title");
const description = document.getElementById("feature-description");
const list = document.getElementById("feature-list");

function loadTab(key){

    const tab = tabs[key];

    title.textContent = tab.title;

    description.textContent = tab.description;

    list.innerHTML = "";

    tab.features.forEach(feature=>{

        list.innerHTML += `<li>${feature}</li>`;

    });

}

document.querySelectorAll(".tab-btn").forEach(button=>{

    button.addEventListener("click",()=>{

        document.querySelector(".tab-btn.active")
            .classList.remove("active");

        button.classList.add("active");

        loadTab(button.dataset.tab);

    });

});

loadTab("collection");