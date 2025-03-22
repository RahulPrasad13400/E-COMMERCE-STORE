import { useEffect, useState } from "react"

export default function FeaturedProducts({featuredProducts}) {

    const [currentIndex, setCurrentIndex] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(4)

    // Adjusts the number of items per page dynamically based on the window width
    useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

    const nextSlide = () => {
        setCurrentIndex(currentIndex => currentIndex + itemsPerPage)
    }

    const prevSlide = () => {
        setCurrentIndex(currentIndex => currentIndex - itemsPerPage)
    }

    const isStartDisabled = currentIndex === 0
    const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        
      </div>
    </div>
  )
}
