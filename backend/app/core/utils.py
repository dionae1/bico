def get_number_or_default(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default