import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "https://plus.unsplash.com/premium_photo-1665664652383-2308d742943c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { href: "/shoes", name: "Shoes", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { href: "/glasses", name: "Glasses", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { href: "/jackets", name: "Jackets", imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { href: "/suits", name: "Suits", imageUrl: "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { href: "/bags", name: "Bags", imageUrl: "https://plus.unsplash.com/premium_photo-1723649902774-4eafa4b42abc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-6xl font-bold text-teal-300 mb-4'>
          Explore Our Categories
        </h1>
        <p className='text-center text-xl text-gray-300 mb-12'>
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>
    </div>
  );
};
export default HomePage;