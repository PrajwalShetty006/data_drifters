def generate_discounts(segment_summary):
    offers = {}

    for segment, count in segment_summary.items():

        if segment == "VIP Customer":
            offers[segment] = "Offer 10% loyalty discount and early access to new arrivals."

        elif segment == "Frequent Buyer":
            offers[segment] = "Provide 5% discount on orders above $50 to boost repeat purchases."

        elif segment == "At Risk Customer":
            offers[segment] = "Give 15% re-engagement discount with free shipping."

        elif segment == "New/Low Value Customer":
            offers[segment] = "Give a 5% welcome discount on their next purchase."

        else:
            offers[segment] = "Standard 5% discount applicable."

    # Select best offer (usually the one for largest segment)
    best_offer_segment = max(segment_summary, key=segment_summary.get)
    best_offer = offers[best_offer_segment]

    return {
        "offers": offers,
        "best_offer": best_offer
    }
