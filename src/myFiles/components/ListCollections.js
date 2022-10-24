import axios from "axios"
import { memo, useEffect, useState } from "react"
import CustomSlide from "../../components/components/CustomSlide"
import api from "../../core/api"

const ListCollections = ({ categoryId = null }) => {
    const [collections, setCollections] = useState(null)

    const getCollections = async () => {
        try {
            const filters = categoryId ? `filters[category]=${categoryId}` : ''
            const populate = 'populate=*'
            const response = await axios.get(`${api.baseUrl + api.collection}?${populate}&filters[status]=active&${filters}`)
            setCollections(response.data)
            console.log(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getCollections()
    }, [])

    return (
        <>
            {
                (collections && collections.data.length > 0) ? (
                    collections.data.map((item, index) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                            <CustomSlide
                                key={index}
                                index={index + 1}
                                avatar={(item.attributes.feature_img.data !== null) ? item.attributes.feature_img.data.attributes.url : `https://via.placeholder.com/300?text=${item.attributes.name}`}
                                banner={api.baseUrl + item.attributes.banner.url}
                                username={item.attributes.name}
                                status={item.attributes.status}
                                // uniqueId={item.unique_id}
                                collectionId={item.id}
                            />
                        </div>
                    ))
                ) : (
                    <h3 className="fw-normal text-center">No items to display</h3>
                )
            }
        </>
    )
}

export default memo(ListCollections)